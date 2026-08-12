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

    public SubmissionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: api/submissions
    // =========================================================
    // Admin   -> gets all submissions
    // Teacher -> gets submissions for their assignments
    // Student -> gets their own submissions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubmissionResponseDto>>> GetSubmissions()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var query = _context.Submissions
            .Include(s => s.Student)
                .ThenInclude(st => st.User)
            .Include(s => s.Assignment)
                .ThenInclude(a => a.Teacher)
                    .ThenInclude(t => t.User)
            .AsQueryable();

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

            query = query.Where(s => s.StudentId == student.Id);
        }
        else if (User.IsInRole("Teacher"))
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

            query = query.Where(s =>
                s.Assignment.TeacherId == teacher.Id);
        }
        else if (!User.IsInRole("Admin"))
        {
            return Forbid();
        }

        var submissions = await query
            .Select(s => new SubmissionResponseDto
            {
                Id = s.Id,
                Answer = s.Answer,
                SubmittedAt = s.SubmittedAt,
                Marks = s.Marks,
                Feedback = s.Feedback,
                Status = s.Status,

                AssignmentId = s.AssignmentId,
                AssignmentTitle = s.Assignment.Title,

                StudentId = s.StudentId,
                StudentName = s.Student.User.FullName
            })
            .ToListAsync();

        return Ok(submissions);
    }

    // =========================================================
    // GET: api/submissions/{id}
    // =========================================================
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SubmissionResponseDto>> GetSubmission(int id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var submission = await _context.Submissions
            .Include(s => s.Student)
                .ThenInclude(st => st.User)
            .Include(s => s.Assignment)
                .ThenInclude(a => a.Teacher)
                    .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null)
        {
            return NotFound(new
            {
                message = "Submission not found."
            });
        }

        // Student can only see their own submission
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
        }

        // Teacher can only see submissions for their assignments
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
        }

        return Ok(MapToResponse(submission));
    }

    // =========================================================
    // POST: api/submissions
    // =========================================================
    // Only Student can create a submission.
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult> CreateSubmission(
        CreateSubmissionDto request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        // Find logged-in student's profile
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId.Value);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student profile not found."
            });
        }

        // Find assignment
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == request.AssignmentId);

        if (assignment == null)
        {
            return BadRequest(new
            {
                message = "Assignment not found."
            });
        }

        // Don't allow submission after deadline
        if (DateTime.UtcNow > assignment.Deadline)
        {
            return BadRequest(new
            {
                message = "The submission deadline has passed."
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

        // Check if student already submitted
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

        var submission = new Submission
        {
            Answer = request.Answer,
            SubmittedAt = DateTime.UtcNow,
            Marks = null,
            Feedback = null,
            Status = SubmissionStatus.Submitted,
            AssignmentId = request.AssignmentId,
            StudentId = student.Id
        };

        _context.Submissions.Add(submission);

        await _context.SaveChangesAsync();

        await _context.Entry(submission)
            .Reference(s => s.Assignment)
            .LoadAsync();

        await _context.Entry(submission)
            .Reference(s => s.Student)
            .LoadAsync();

        return CreatedAtAction(
            nameof(GetSubmission),
            new { id = submission.Id },
            MapToResponse(submission)
        );
    }

    // =========================================================
    // PUT: api/submissions/{id}
    // =========================================================
    // Student can update their own answer before deadline.
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult> UpdateSubmission(
        int id,
        UpdateSubmissionDto request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserId == userId.Value);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student profile not found."
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

        // Student can only update their own submission
        if (submission.StudentId != student.Id)
        {
            return Forbid();
        }

        // Don't allow editing after deadline
        if (DateTime.UtcNow > submission.Assignment.Deadline)
        {
            return BadRequest(new
            {
                message = "The submission deadline has passed."
            });
        }

        // Don't allow editing after grading
        if (submission.Marks != null)
        {
            return BadRequest(new
            {
                message = "A graded submission cannot be edited."
            });
        }

        submission.Answer = request.Answer;
        submission.SubmittedAt = DateTime.UtcNow;
        submission.Status = SubmissionStatus.UnderReview;

        await _context.SaveChangesAsync();

        return Ok(MapToResponse(submission));
    }

    // =========================================================
    // PUT: api/submissions/{id}/grade
    // =========================================================
    // Only Teacher can grade their own assignment submissions.
    [HttpPut("{id:int}/grade")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult> GradeSubmission(
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

        // Teacher can only grade their own assignments
        if (submission.Assignment.TeacherId != teacher.Id)
        {
            return Forbid();
        }

        // Validate marks
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
    // DELETE: api/submissions/{id}
    // =========================================================
    // Only Admin can delete submissions.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteSubmission(int id)
    {
        var submission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission == null)
        {
            return NotFound(new
            {
                message = "Submission not found."
            });
        }

        _context.Submissions.Remove(submission);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =========================================================
    // Helper: Get logged-in User ID from JWT
    // =========================================================
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdClaim))
        {
            userIdClaim = User.FindFirstValue(
                System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
        }

        if (int.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }

        return null;
    }

    // =========================================================
    // Helper: Map entity to DTO
    // =========================================================
    private static SubmissionResponseDto MapToResponse(
        Submission submission)
    {
        return new SubmissionResponseDto
        {
            Id = submission.Id,
            Answer = submission.Answer,
            SubmittedAt = submission.SubmittedAt,
            Marks = submission.Marks,
            Feedback = submission.Feedback,
            Status = submission.Status,

            AssignmentId = submission.AssignmentId,
            AssignmentTitle = submission.Assignment.Title,

            StudentId = submission.StudentId,
            StudentName = submission.Student.User.FullName
        };
    }
}