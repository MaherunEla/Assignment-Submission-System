using System.Security.Claims;
using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Assignments;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/assignments")]
[Authorize(Roles = "Admin,Teacher")]
public class AssignmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AssignmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AssignmentResponseDto>>> GetAssignments()
    {
        var assignments = await _context.Assignments
            .Include(a => a.Teacher)
                .ThenInclude(t => t.User)
            .Include(a => a.AcademicClass)
            .Include(a => a.Subject)
            .Select(a => new AssignmentResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Deadline = a.Deadline,
                MaximumMarks = a.MaximumMarks,
                IsPublished = a.IsPublished,

                TeacherId = a.TeacherId,
                TeacherName = a.Teacher.User.FullName,

                AcademicClassId = a.AcademicClassId,
                AcademicClassName = a.AcademicClass.Name,

                SubjectId = a.SubjectId,
                SubjectName = a.Subject.Name
            })
            .ToListAsync();

        return Ok(assignments);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssignmentResponseDto>> GetAssignment(int id)
    {
        var assignment = await _context.Assignments
            .Include(a => a.Teacher)
                .ThenInclude(t => t.User)
            .Include(a => a.AcademicClass)
            .Include(a => a.Subject)
            .Where(a => a.Id == id)
            .Select(a => new AssignmentResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Deadline = a.Deadline,
                MaximumMarks = a.MaximumMarks,
                IsPublished = a.IsPublished,

                TeacherId = a.TeacherId,
                TeacherName = a.Teacher.User.FullName,

                AcademicClassId = a.AcademicClassId,
                AcademicClassName = a.AcademicClass.Name,

                SubjectId = a.SubjectId,
                SubjectName = a.Subject.Name
            })
            .FirstOrDefaultAsync();

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Assignment not found."
            });
        }

        return Ok(assignment);
    }

    // =========================================================
    // CREATE
    // =========================================================

    [HttpPost]
    public async Task<ActionResult> CreateAssignment(
        CreateAssignmentDto request)
    {
        var isAdmin = User.IsInRole("Admin");

        int teacherId;

        if (isAdmin)
        {
            // Admin can create an assignment for any teacher.
            teacherId = request.TeacherId;
        }
        else
        {
            // TeacherId comes from JWT, NOT from request.
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = "User identity could not be determined."
                });
            }

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null)
            {
              return StatusCode(StatusCodes.Status403Forbidden, new
             {
                  message = "Teacher profile not found."
              });
            }

            teacherId = teacher.Id;
        }

        // =====================================================
        // Check Teacher
        // =====================================================

        var teacherExists = await _context.Teachers
            .Include(t => t.User)
            .AnyAsync(t => t.Id == teacherId);

        if (!teacherExists)
        {
            return BadRequest(new
            {
                message = "Teacher not found."
            });
        }

        // =====================================================
        // Check Academic Class
        // =====================================================

        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // =====================================================
        // Check Subject
        // =====================================================

        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == request.SubjectId);

        if (subject == null)
        {
            return BadRequest(new
            {
                message = "Subject not found."
            });
        }

        // Subject must belong to selected class.
        if (subject.AcademicClassId != request.AcademicClassId)
        {
            return BadRequest(new
            {
                message = "The selected subject does not belong to the selected academic class."
            });
        }

        // =====================================================
        // Teacher must be assigned to this
        // Teacher + Class + Subject combination.
        // =====================================================

        if (!isAdmin)
        {
            var teacherAssignmentExists =
                await _context.TeacherAssignments.AnyAsync(ta =>
                    ta.TeacherId == teacherId &&
                    ta.AcademicClassId == request.AcademicClassId &&
                    ta.SubjectId == request.SubjectId);

            if (!teacherAssignmentExists)
            {
                return Forbid();
            }
        }

        // =====================================================
        // Create Assignment
        // =====================================================

        var assignment = new Assignment
        {
            Title = request.Title,
            Description = request.Description,
            Deadline = request.Deadline,
            MaximumMarks = request.MaximumMarks,
            IsPublished = request.IsPublished,

            TeacherId = teacherId,
            AcademicClassId = request.AcademicClassId,
            SubjectId = request.SubjectId
        };

        _context.Assignments.Add(assignment);

        await _context.SaveChangesAsync();

        // =====================================================
        // Load response
        // =====================================================

        var response = await _context.Assignments
            .Include(a => a.Teacher)
                .ThenInclude(t => t.User)
            .Include(a => a.AcademicClass)
            .Include(a => a.Subject)
            .Where(a => a.Id == assignment.Id)
            .Select(a => new AssignmentResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Deadline = a.Deadline,
                MaximumMarks = a.MaximumMarks,
                IsPublished = a.IsPublished,

                TeacherId = a.TeacherId,
                TeacherName = a.Teacher.User.FullName,

                AcademicClassId = a.AcademicClassId,
                AcademicClassName = a.AcademicClass.Name,

                SubjectId = a.SubjectId,
                SubjectName = a.Subject.Name
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetAssignment),
            new { id = assignment.Id },
            response);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateAssignment(
        int id,
        UpdateAssignmentDto request)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Assignment not found."
            });
        }

        var isAdmin = User.IsInRole("Admin");

        int teacherId;

        if (isAdmin)
        {
            teacherId = request.TeacherId;
        }
        else
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) ||
                !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null)
            {
               return StatusCode(StatusCodes.Status403Forbidden, new
                 {
                    message = "Teacher profile not found."
                 });
            }

            teacherId = teacher.Id;

            // Teacher can only update their own assignment.
            if (assignment.TeacherId != teacherId)
            {
                return Forbid();
            }
        }

        // =====================================================
        // Check Teacher
        // =====================================================

        var teacherExists = await _context.Teachers
            .AnyAsync(t => t.Id == teacherId);

        if (!teacherExists)
        {
            return BadRequest(new
            {
                message = "Teacher not found."
            });
        }

        // =====================================================
        // Check Academic Class
        // =====================================================

        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // =====================================================
        // Check Subject
        // =====================================================

        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == request.SubjectId);

        if (subject == null)
        {
            return BadRequest(new
            {
                message = "Subject not found."
            });
        }

        if (subject.AcademicClassId != request.AcademicClassId)
        {
            return BadRequest(new
            {
                message = "The selected subject does not belong to the selected academic class."
            });
        }

        // =====================================================
        // Check TeacherAssignment
        // =====================================================

        if (!isAdmin)
        {
            var teacherAssignmentExists =
                await _context.TeacherAssignments.AnyAsync(ta =>
                    ta.TeacherId == teacherId &&
                    ta.AcademicClassId == request.AcademicClassId &&
                    ta.SubjectId == request.SubjectId);

            if (!teacherAssignmentExists)
            {
                return Forbid();
            }
        }

        // =====================================================
        // Update
        // =====================================================

        assignment.Title = request.Title;
        assignment.Description = request.Description;
        assignment.Deadline = request.Deadline;
        assignment.MaximumMarks = request.MaximumMarks;
        assignment.IsPublished = request.IsPublished;

        assignment.TeacherId = teacherId;
        assignment.AcademicClassId = request.AcademicClassId;
        assignment.SubjectId = request.SubjectId;

        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // =====================================================
        // Response
        // =====================================================

        var response = await _context.Assignments
            .Include(a => a.Teacher)
                .ThenInclude(t => t.User)
            .Include(a => a.AcademicClass)
            .Include(a => a.Subject)
            .Where(a => a.Id == assignment.Id)
            .Select(a => new AssignmentResponseDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Deadline = a.Deadline,
                MaximumMarks = a.MaximumMarks,
                IsPublished = a.IsPublished,

                TeacherId = a.TeacherId,
                TeacherName = a.Teacher.User.FullName,

                AcademicClassId = a.AcademicClassId,
                AcademicClassName = a.AcademicClass.Name,

                SubjectId = a.SubjectId,
                SubjectName = a.Subject.Name
            })
            .FirstAsync();

        return Ok(response);
    }

    // =========================================================
    // DELETE
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteAssignment(int id)
    {
        var assignment = await _context.Assignments
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Assignment not found."
            });
        }

        var isAdmin = User.IsInRole("Admin");

        if (!isAdmin)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim) ||
                !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null)
            {
                return Forbid();
            }

            // Teacher can delete only their own assignment.
            if (assignment.TeacherId != teacher.Id)
            {
                return Forbid();
            }
        }

        _context.Assignments.Remove(assignment);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}