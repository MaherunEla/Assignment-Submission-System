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

    // GET: api/assignments
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

    // GET: api/assignments/1
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

    // POST: api/assignments
    [HttpPost]
    public async Task<ActionResult> CreateAssignment(
        CreateAssignmentDto request)
    {
        // Check Teacher
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.TeacherId);

        if (teacher == null)
        {
            return BadRequest(new
            {
                message = "Teacher not found."
            });
        }

        // Check Academic Class
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // Check Subject
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == request.SubjectId);

        if (subject == null)
        {
            return BadRequest(new
            {
                message = "Subject not found."
            });
        }

        // Make sure subject belongs to selected class
        if (subject.AcademicClassId != request.AcademicClassId)
        {
            return BadRequest(new
            {
                message = "The selected subject does not belong to the selected academic class."
            });
        }

        var assignment = new Assignment
        {
            Title = request.Title,
            Description = request.Description,
            Deadline = request.Deadline,
            MaximumMarks = request.MaximumMarks,
            IsPublished = request.IsPublished,
            TeacherId = request.TeacherId,
            AcademicClassId = request.AcademicClassId,
            SubjectId = request.SubjectId
        };

        _context.Assignments.Add(assignment);

        await _context.SaveChangesAsync();

        var response = new AssignmentResponseDto
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            CreatedAt = assignment.CreatedAt,
            UpdatedAt = assignment.UpdatedAt,
            Deadline = assignment.Deadline,
            MaximumMarks = assignment.MaximumMarks,
            IsPublished = assignment.IsPublished,

            TeacherId = teacher.Id,
            TeacherName = teacher.User.FullName,

            AcademicClassId = academicClass.Id,
            AcademicClassName = academicClass.Name,

            SubjectId = subject.Id,
            SubjectName = subject.Name
        };

        return CreatedAtAction(
            nameof(GetAssignment),
            new { id = assignment.Id },
            response
        );
    }

    // PUT: api/assignments/1
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

        // Check Teacher
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == request.TeacherId);

        if (teacher == null)
        {
            return BadRequest(new
            {
                message = "Teacher not found."
            });
        }

        // Check Academic Class
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // Check Subject
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == request.SubjectId);

        if (subject == null)
        {
            return BadRequest(new
            {
                message = "Subject not found."
            });
        }

        // Make sure subject belongs to selected class
        if (subject.AcademicClassId != request.AcademicClassId)
        {
            return BadRequest(new
            {
                message = "The selected subject does not belong to the selected academic class."
            });
        }

        assignment.Title = request.Title;
        assignment.Description = request.Description;
        assignment.Deadline = request.Deadline;
        assignment.MaximumMarks = request.MaximumMarks;
        assignment.IsPublished = request.IsPublished;
        assignment.TeacherId = request.TeacherId;
        assignment.AcademicClassId = request.AcademicClassId;
        assignment.SubjectId = request.SubjectId;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new AssignmentResponseDto
        {
            Id = assignment.Id,
            Title = assignment.Title,
            Description = assignment.Description,
            CreatedAt = assignment.CreatedAt,
            UpdatedAt = assignment.UpdatedAt,
            Deadline = assignment.Deadline,
            MaximumMarks = assignment.MaximumMarks,
            IsPublished = assignment.IsPublished,

            TeacherId = teacher.Id,
            TeacherName = teacher.User.FullName,

            AcademicClassId = academicClass.Id,
            AcademicClassName = academicClass.Name,

            SubjectId = subject.Id,
            SubjectName = subject.Name
        });
    }

    // DELETE: api/assignments/1
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

        _context.Assignments.Remove(assignment);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}