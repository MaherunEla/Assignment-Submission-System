using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Subjects;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/subjects")]
[Authorize(Roles = "Admin")]
public class SubjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/subjects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubjectResponseDto>>> GetSubjects()
    {
        var subjects = await _context.Subjects
            .Include(s => s.AcademicClass)
            .Select(s => new SubjectResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                AcademicClassId = s.AcademicClassId,
                AcademicClassName = s.AcademicClass.Name
            })
            .ToListAsync();

        return Ok(subjects);
    }

    // GET: api/subjects/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SubjectResponseDto>> GetSubject(int id)
    {
        var subject = await _context.Subjects
            .Include(s => s.AcademicClass)
            .Where(s => s.Id == id)
            .Select(s => new SubjectResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                AcademicClassId = s.AcademicClassId,
                AcademicClassName = s.AcademicClass.Name
            })
            .FirstOrDefaultAsync();

        if (subject == null)
        {
            return NotFound(new
            {
                message = "Subject not found."
            });
        }

        return Ok(subject);
    }

    // POST: api/subjects
    [HttpPost]
    public async Task<ActionResult> CreateSubject(
        CreateSubjectDto request)
    {
        // Check whether the academic class exists
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // Check duplicate subject within the same class
        var subjectExists = await _context.Subjects
            .AnyAsync(s =>
                s.Name == request.Name &&
                s.AcademicClassId == request.AcademicClassId);

        if (subjectExists)
        {
            return Conflict(new
            {
                message = "This subject already exists for this academic class."
            });
        }

        var subject = new Subject
        {
            Name = request.Name,
            AcademicClassId = request.AcademicClassId
        };

        _context.Subjects.Add(subject);

        await _context.SaveChangesAsync();

        var response = new SubjectResponseDto
        {
            Id = subject.Id,
            Name = subject.Name,
            AcademicClassId = subject.AcademicClassId,
            AcademicClassName = academicClass.Name
        };

        return CreatedAtAction(
            nameof(GetSubject),
            new { id = subject.Id },
            response
        );
    }

    // PUT: api/subjects/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateSubject(
        int id,
        UpdateSubjectDto request)
    {
        var subject = await _context.Subjects
            .Include(s => s.AcademicClass)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subject == null)
        {
            return NotFound(new
            {
                message = "Subject not found."
            });
        }

        // Check whether the new academic class exists
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

        if (academicClass == null)
        {
            return BadRequest(new
            {
                message = "Academic class not found."
            });
        }

        // Check duplicate subject in the target class
        var subjectExists = await _context.Subjects
            .AnyAsync(s =>
                s.Name == request.Name &&
                s.AcademicClassId == request.AcademicClassId &&
                s.Id != id);

        if (subjectExists)
        {
            return Conflict(new
            {
                message = "This subject already exists for this academic class."
            });
        }

        subject.Name = request.Name;
        subject.AcademicClassId = request.AcademicClassId;

        await _context.SaveChangesAsync();

        return Ok(new SubjectResponseDto
        {
            Id = subject.Id,
            Name = subject.Name,
            AcademicClassId = subject.AcademicClassId,
            AcademicClassName = academicClass.Name
        });
    }

    // DELETE: api/subjects/1
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteSubject(int id)
    {
        var subject = await _context.Subjects
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subject == null)
        {
            return NotFound(new
            {
                message = "Subject not found."
            });
        }

        _context.Subjects.Remove(subject);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}