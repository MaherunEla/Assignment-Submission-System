using System.Security.Claims;
using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Submissions;
using AssignmentSubmissionSystem.API.Enums;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/submissions")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public SubmissionsController(
        ApplicationDbContext context,
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _context = context;
        _environment = environment;
        _configuration = configuration;
    }

    // =========================================================
    // CREATE SUBMISSION
    // POST: api/submissions
    // Student only
    // =========================================================

    [HttpPost]
    [Authorize(Roles = "Student")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<SubmissionResponseDto>> CreateSubmission(
        [FromForm] CreateSubmissionDto request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student profile not found."
            });
        }

        // Find assignment
        var assignment = await _context.Assignments
            .Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == request.AssignmentId);

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Assignment not found."
            });
        }

        // Assignment must be published
        if (!assignment.IsPublished)
        {
            return BadRequest(new
            {
                message = "This assignment is not published."
            });
        }

        // Student must belong to assignment's class
        if (student.AcademicClassId != assignment.AcademicClassId)
        {
            return Forbid();
        }

        // Check deadline
        if (DateTime.UtcNow > assignment.Deadline)
        {
            return BadRequest(new
            {
                message = "The assignment deadline has passed."
            });
        }

        // Prevent duplicate submission
        var existingSubmission = await _context.Submissions
            .FirstOrDefaultAsync(s =>
                s.AssignmentId == request.AssignmentId &&
                s.StudentId == student.Id);

        if (existingSubmission != null)
        {
            return Conflict(new
            {
                message = "You have already submitted this assignment."
            });
        }

        // At least answer or file must exist
        if (string.IsNullOrWhiteSpace(request.Answer) &&
            request.File == null)
        {
            return BadRequest(new
            {
                message = "Please provide an answer or upload a file."
            });
        }

        string? fileName = null;
        string? filePath = null;
        string? fileContentType = null;
        long? fileSize = null;

        // Handle file
        if (request.File != null)
        {
            var validationResult = ValidateFile(request.File);

            if (validationResult != null)
            {
                return BadRequest(new
                {
                    message = validationResult
                });
            }

            var uploadFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "submissions");

            Directory.CreateDirectory(uploadFolder);

            var extension = Path.GetExtension(
                request.File.FileName);

            var storedFileName =
                $"{Guid.NewGuid()}{extension}";

            var physicalPath = Path.Combine(
                uploadFolder,
                storedFileName);

            await using var stream =
                new FileStream(
                    physicalPath,
                    FileMode.Create);

            await request.File.CopyToAsync(stream);

            fileName = Path.GetFileName(request.File.FileName);
            filePath = $"/uploads/submissions/{storedFileName}";
            fileContentType = request.File.ContentType;
            fileSize = request.File.Length;
        }

        var submission = new Submission
        {
            AssignmentId = assignment.Id,
            StudentId = student.Id,
            Answer = request.Answer ?? string.Empty,
            SubmittedAt = DateTime.UtcNow,
            Status = SubmissionStatus.Submitted,

            FileName = fileName,
            FilePath = filePath,
            FileContentType = fileContentType,
            FileSize = fileSize
        };

        _context.Submissions.Add(submission);

        await _context.SaveChangesAsync();

        var response = new SubmissionResponseDto
        {
            Id = submission.Id,
            AssignmentId = assignment.Id,
            AssignmentTitle = assignment.Title,
            StudentId = student.Id,
            Answer = submission.Answer,
            SubmittedAt = submission.SubmittedAt,
            Marks = submission.Marks,
            Feedback = submission.Feedback,
            Status = submission.Status,
            FileName = submission.FileName,
            FileUrl = submission.FilePath,
            FileContentType = submission.FileContentType,
            FileSize = submission.FileSize
        };

        return CreatedAtAction(
            nameof(GetSubmission),
            new { id = submission.Id },
            response);
    }

    // =========================================================
// GET ALL SUBMISSIONS
// Admin only
// =========================================================

[HttpGet]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<IEnumerable<SubmissionResponseDto>>>
    GetSubmissions()
{
    var submissions = await _context.Submissions
        .Include(s => s.Assignment)
        .Include(s => s.Student)
            .ThenInclude(s => s.User)
        .OrderByDescending(s => s.SubmittedAt)
        .ToListAsync();

    return Ok(
        submissions.Select(MapToResponse)
    );
}

    // =========================================================
    // GET SINGLE SUBMISSION
    // =========================================================

   [HttpGet("{id:int}")]
[Authorize(Roles = "Admin,Teacher,Student")]
public async Task<ActionResult<SubmissionResponseDto>> GetSubmission(int id)
{
    var submission = await _context.Submissions
        .Include(s => s.Assignment)
        .Include(s => s.Student)
            .ThenInclude(s => s.User)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (submission == null)
    {
        return NotFound(new
        {
            message = "Submission not found."
        });
    }

    var userId = GetCurrentUserId();

    if (userId == null)
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    // Admin can view everything
    if (User.IsInRole("Admin"))
    {
        return Ok(MapToResponse(submission));
    }

    // Teacher can only view submissions
    // belonging to their own assignments
    if (User.IsInRole("Teacher"))
    {
        var teacher = await _context.Teachers
            .FirstOrDefaultAsync(t => t.UserId == userId.Value);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Teacher profile not found."
            });
        }

        if (submission.Assignment.TeacherId != teacher.Id)
        {
            return Forbid();
        }

        return Ok(MapToResponse(submission));
    }

    // Student can only view their own submission
    if (User.IsInRole("Student"))
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId.Value);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student profile not found."
            });
        }

        if (submission.StudentId != student.Id)
        {
            return Forbid();
        }

        return Ok(MapToResponse(submission));
    }

    return Forbid();
}

    // =========================================================
    // GET MY SUBMISSIONS
    // =========================================================

    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<IEnumerable<SubmissionResponseDto>>>
        GetMySubmissions()
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student profile not found."
            });
        }

        var submissions = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
                .ThenInclude(s => s.User)
            .Where(s => s.StudentId == student.Id)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        return Ok(
            submissions.Select(MapToResponse));
    }

    // =========================================================
    // UPDATE SUBMISSION
    // Student can update before deadline
    // =========================================================

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Student")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<SubmissionResponseDto>>
        UpdateSubmission(
            int id,
            [FromForm] UpdateSubmissionDto request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null)
        {
            return NotFound(new
            {
                message = "Submission not found."
            });
        }

        if (submission.Student.UserId != userId)
        {
            return Forbid();
        }

        if (DateTime.UtcNow > submission.Assignment.Deadline)
        {
            return BadRequest(new
            {
                message = "The assignment deadline has passed."
            });
        }

        if (!string.IsNullOrWhiteSpace(request.Answer))
        {
            submission.Answer = request.Answer;
        }

        // Replace file
        if (request.File != null)
        {
            var validationResult = ValidateFile(request.File);

            if (validationResult != null)
            {
                return BadRequest(new
                {
                    message = validationResult
                });
            }

            // Delete old file
            DeletePhysicalFile(submission.FilePath);

            var uploadFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "submissions");

            Directory.CreateDirectory(uploadFolder);

            var extension = Path.GetExtension(
                request.File.FileName);

            var storedFileName =
                $"{Guid.NewGuid()}{extension}";

            var physicalPath = Path.Combine(
                uploadFolder,
                storedFileName);

            await using var stream =
                new FileStream(
                    physicalPath,
                    FileMode.Create);

            await request.File.CopyToAsync(stream);

            submission.FileName =
                Path.GetFileName(request.File.FileName);

            submission.FilePath =
                $"/uploads/submissions/{storedFileName}";

            submission.FileContentType =
                request.File.ContentType;

            submission.FileSize =
                request.File.Length;
        }

        await _context.SaveChangesAsync();

        return Ok(MapToResponse(submission));
    }

    // =========================================================
    // DELETE SUBMISSION
    // Student before deadline / Admin
    // =========================================================

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Student")]
    public async Task<ActionResult> DeleteSubmission(int id)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null)
        {
            return NotFound(new
            {
                message = "Submission not found."
            });
        }

        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin)
        {
            if (!int.TryParse(userIdClaim, out int userId) ||
                submission.Student.UserId != userId)
            {
                return Forbid();
            }

            if (DateTime.UtcNow > submission.Assignment.Deadline)
            {
                return BadRequest(new
                {
                    message = "You cannot delete a submission after the deadline."
                });
            }
        }

        DeletePhysicalFile(submission.FilePath);

        _context.Submissions.Remove(submission);

        await _context.SaveChangesAsync();

        return NoContent();
    }

   

   // =========================================================
// GET SUBMISSIONS FOR AN ASSIGNMENT
// Admin + Teacher
// =========================================================

[HttpGet("assignment/{assignmentId:int}")]
[Authorize(Roles = "Admin,Teacher")]
public async Task<ActionResult<IEnumerable<SubmissionResponseDto>>>
    GetAssignmentSubmissions(int assignmentId)
{
    var assignment = await _context.Assignments
        .FirstOrDefaultAsync(a => a.Id == assignmentId);

    if (assignment == null)
    {
        return NotFound(new
        {
            message = "Assignment not found."
        });
    }

    var query = _context.Submissions
        .Include(s => s.Assignment)
        .Include(s => s.Student)
            .ThenInclude(st => st.User)
        .Where(s => s.AssignmentId == assignmentId);

    // Teacher can only see submissions
    // for their own assignment
    if (User.IsInRole("Teacher"))
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var teacher = await _context.Teachers
            .FirstOrDefaultAsync(t => t.UserId == userId.Value);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Teacher profile not found."
            });
        }

        if (assignment.TeacherId != teacher.Id)
        {
            return Forbid();
        }
    }

    var submissions = await query
        .OrderByDescending(s => s.SubmittedAt)
        .ToListAsync();

    return Ok(
        submissions.Select(MapToResponse)
    );


}

// =========================================================
// GRADE SUBMISSION
// Teacher only
// =========================================================

[HttpPut("{id:int}/grade")]
[Authorize(Roles = "Teacher")]
public async Task<ActionResult<SubmissionResponseDto>>
    GradeSubmission(
        int id,
        GradeSubmissionRequest request)
{
    var userId = GetCurrentUserId();

    if (userId == null)
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    var teacher = await _context.Teachers
        .FirstOrDefaultAsync(t => t.UserId == userId.Value);

    if (teacher == null)
    {
        return NotFound(new
        {
            message = "Teacher profile not found."
        });
    }

    var submission = await _context.Submissions
        .Include(s => s.Assignment)
        .Include(s => s.Student)
            .ThenInclude(st => st.User)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (submission == null)
    {
        return NotFound(new
        {
            message = "Submission not found."
        });
    }

    // Teacher can only grade submissions
    // belonging to their own assignment
    if (submission.Assignment.TeacherId != teacher.Id)
    {
        return Forbid();
    }

    if (request.Marks < 0 ||
        request.Marks > submission.Assignment.MaximumMarks)
    {
        return BadRequest(new
        {
            message =
                $"Marks must be between 0 and {submission.Assignment.MaximumMarks}."
        });
    }

    submission.Marks = request.Marks;
    submission.Feedback = request.Feedback;
    submission.Status = SubmissionStatus.Reviewed;

    await _context.SaveChangesAsync();

    return Ok(MapToResponse(submission));
}

    // =========================================================
    // PRIVATE HELPERS
    // =========================================================

    private int? GetCurrentUserId()
{
    var userIdClaim = User.FindFirstValue(
        ClaimTypes.NameIdentifier);

    if (int.TryParse(userIdClaim, out int userId))
    {
        return userId;
    }

    return null;
}

    private string? ValidateFile(IFormFile file)
    {
        const long maxSize = 10 * 1024 * 1024;

        if (file.Length == 0)
        {
            return "The uploaded file is empty.";
        }

        if (file.Length > maxSize)
        {
            return "File size cannot exceed 10 MB.";
        }

        var allowedExtensions = new[]
        {
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".zip"
        };

        var extension =
            Path.GetExtension(file.FileName)
                .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return "Only PDF, DOC, DOCX, TXT and ZIP files are allowed.";
        }

        return null;
    }

    private void DeletePhysicalFile(string? filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return;

        var relativePath = filePath
            .TrimStart('/')
            .Replace(
                '/',
                Path.DirectorySeparatorChar);

        var physicalPath = Path.Combine(
            _environment.WebRootPath,
            relativePath);

        if (System.IO.File.Exists(physicalPath))
        {
            System.IO.File.Delete(physicalPath);
        }
    }

    private static SubmissionResponseDto MapToResponse(
        Submission submission)
    {
        return new SubmissionResponseDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            AssignmentTitle = submission.Assignment.Title,

            StudentId = submission.StudentId,
            StudentName = submission.Student.User.FullName,

            Answer = submission.Answer,
            SubmittedAt = submission.SubmittedAt,

            Marks = submission.Marks,
            Feedback = submission.Feedback,
            Status = submission.Status,

            FileName = submission.FileName,
            FileUrl = submission.FilePath,
            FileContentType = submission.FileContentType,
            FileSize = submission.FileSize
        };
    }
}