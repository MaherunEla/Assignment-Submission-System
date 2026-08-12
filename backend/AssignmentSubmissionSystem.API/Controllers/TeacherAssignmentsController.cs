using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.TeacherAssignments;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/teacher-assignments")]
[Authorize(Roles = "Admin")]
public class TeacherAssignmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TeacherAssignmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/teacher-assignments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherAssignmentResponseDto>>> GetTeacherAssignments()
    {
        var assignments = await _context.TeacherAssignments
            .Include(ta => ta.Teacher)
                .ThenInclude(t => t.User)
            .Include(ta => ta.AcademicClass)
            .Include(ta => ta.Subject)
            .Select(ta => new TeacherAssignmentResponseDto
            {
                Id = ta.Id,

                TeacherId = ta.TeacherId,
                TeacherName = ta.Teacher.User.FullName,

                AcademicClassId = ta.AcademicClassId,
                AcademicClassName = ta.AcademicClass.Name,

                SubjectId = ta.SubjectId,
                SubjectName = ta.Subject.Name
            })
            .ToListAsync();

        return Ok(assignments);
    }

    // GET: api/teacher-assignments/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeacherAssignmentResponseDto>> GetTeacherAssignment(int id)
    {
        var assignment = await _context.TeacherAssignments
            .Include(ta => ta.Teacher)
                .ThenInclude(t => t.User)
            .Include(ta => ta.AcademicClass)
            .Include(ta => ta.Subject)
            .Where(ta => ta.Id == id)
            .Select(ta => new TeacherAssignmentResponseDto
            {
                Id = ta.Id,

                TeacherId = ta.TeacherId,
                TeacherName = ta.Teacher.User.FullName,

                AcademicClassId = ta.AcademicClassId,
                AcademicClassName = ta.AcademicClass.Name,

                SubjectId = ta.SubjectId,
                SubjectName = ta.Subject.Name
            })
            .FirstOrDefaultAsync();

        if (assignment == null)
        {
            return NotFound(new
            {
                message = "Teacher assignment not found."
            });
        }

        return Ok(assignment);
    }

    // POST: api/teacher-assignments
    [HttpPost]
    public async Task<ActionResult<TeacherAssignmentResponseDto>> CreateTeacherAssignment(
        CreateTeacherAssignmentDto request)
    {
        var teacherExists = await _context.Teachers
            .AnyAsync(t => t.Id == request.TeacherId);

        if (!teacherExists)
        {
            return BadRequest(new
            {
                message = "Invalid teacher."
            });
        }

        var classExists = await _context.AcademicClasses
            .AnyAsync(c => c.Id == request.AcademicClassId);

        if (!classExists)
        {
            return BadRequest(new
            {
                message = "Invalid academic class."
            });
        }

        var subjectExists = await _context.Subjects
            .AnyAsync(s =>
                s.Id == request.SubjectId &&
                s.AcademicClassId == request.AcademicClassId);

        if (!subjectExists)
        {
            return BadRequest(new
            {
                message = "Invalid subject for the selected academic class."
            });
        }

        var alreadyExists = await _context.TeacherAssignments
            .AnyAsync(ta =>
                ta.TeacherId == request.TeacherId &&
                ta.AcademicClassId == request.AcademicClassId &&
                ta.SubjectId == request.SubjectId);

        if (alreadyExists)
        {
            return Conflict(new
            {
                message = "This teacher is already assigned to this subject and class."
            });
        }

        var teacherAssignment = new TeacherAssignment
        {
            TeacherId = request.TeacherId,
            AcademicClassId = request.AcademicClassId,
            SubjectId = request.SubjectId
        };

        _context.TeacherAssignments.Add(teacherAssignment);

        await _context.SaveChangesAsync();

        var createdAssignment = await _context.TeacherAssignments
            .Include(ta => ta.Teacher)
                .ThenInclude(t => t.User)
            .Include(ta => ta.AcademicClass)
            .Include(ta => ta.Subject)
            .Where(ta => ta.Id == teacherAssignment.Id)
            .Select(ta => new TeacherAssignmentResponseDto
            {
                Id = ta.Id,

                TeacherId = ta.TeacherId,
                TeacherName = ta.Teacher.User.FullName,

                AcademicClassId = ta.AcademicClassId,
                AcademicClassName = ta.AcademicClass.Name,

                SubjectId = ta.SubjectId,
                SubjectName = ta.Subject.Name
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetTeacherAssignment),
            new { id = teacherAssignment.Id },
            createdAssignment);
    }

    // PUT: api/teacher-assignments/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TeacherAssignmentResponseDto>> UpdateTeacherAssignment(
        int id,
        UpdateTeacherAssignmentDto request)
    {
        var teacherAssignment = await _context.TeacherAssignments
            .FirstOrDefaultAsync(ta => ta.Id == id);

        if (teacherAssignment == null)
        {
            return NotFound(new
            {
                message = "Teacher assignment not found."
            });
        }

        var teacherExists = await _context.Teachers
            .AnyAsync(t => t.Id == request.TeacherId);

        if (!teacherExists)
        {
            return BadRequest(new
            {
                message = "Invalid teacher."
            });
        }

        var classExists = await _context.AcademicClasses
            .AnyAsync(c => c.Id == request.AcademicClassId);

        if (!classExists)
        {
            return BadRequest(new
            {
                message = "Invalid academic class."
            });
        }

        var subjectExists = await _context.Subjects
            .AnyAsync(s =>
                s.Id == request.SubjectId &&
                s.AcademicClassId == request.AcademicClassId);

        if (!subjectExists)
        {
            return BadRequest(new
            {
                message = "Invalid subject for the selected academic class."
            });
        }

        var duplicateExists = await _context.TeacherAssignments
            .AnyAsync(ta =>
                ta.Id != id &&
                ta.TeacherId == request.TeacherId &&
                ta.AcademicClassId == request.AcademicClassId &&
                ta.SubjectId == request.SubjectId);

        if (duplicateExists)
        {
            return Conflict(new
            {
                message = "This teacher is already assigned to this subject and class."
            });
        }

        teacherAssignment.TeacherId = request.TeacherId;
        teacherAssignment.AcademicClassId = request.AcademicClassId;
        teacherAssignment.SubjectId = request.SubjectId;

        await _context.SaveChangesAsync();

        var updatedAssignment = await _context.TeacherAssignments
            .Include(ta => ta.Teacher)
                .ThenInclude(t => t.User)
            .Include(ta => ta.AcademicClass)
            .Include(ta => ta.Subject)
            .Where(ta => ta.Id == id)
            .Select(ta => new TeacherAssignmentResponseDto
            {
                Id = ta.Id,

                TeacherId = ta.TeacherId,
                TeacherName = ta.Teacher.User.FullName,

                AcademicClassId = ta.AcademicClassId,
                AcademicClassName = ta.AcademicClass.Name,

                SubjectId = ta.SubjectId,
                SubjectName = ta.Subject.Name
            })
            .FirstAsync();

        return Ok(updatedAssignment);
    }

    // DELETE: api/teacher-assignments/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeacherAssignment(int id)
    {
        var teacherAssignment = await _context.TeacherAssignments
            .FindAsync(id);

        if (teacherAssignment == null)
        {
            return NotFound(new
            {
                message = "Teacher assignment not found."
            });
        }

        _context.TeacherAssignments.Remove(teacherAssignment);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}