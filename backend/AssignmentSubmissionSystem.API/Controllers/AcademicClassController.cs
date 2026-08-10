using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.AcademicClasses;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/academic-classes")]
[Authorize(Roles = "Admin")]
public class AcademicClassesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AcademicClassesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/academic-classes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AcademicClassResponseDto>>> GetAcademicClasses()
    {
        var classes = await _context.AcademicClasses
            .Select(c => new AcademicClassResponseDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(classes);
    }

    // GET: api/academic-classes/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AcademicClassResponseDto>> GetAcademicClass(int id)
    {
        var academicClass = await _context.AcademicClasses
            .Where(c => c.Id == id)
            .Select(c => new AcademicClassResponseDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .FirstOrDefaultAsync();

        if (academicClass == null)
        {
            return NotFound(new
            {
                message = "Academic class not found."
            });
        }

        return Ok(academicClass);
    }

    // POST: api/academic-classes
    [HttpPost]
    public async Task<ActionResult> CreateAcademicClass(
        CreateAcademicClassDto request)
    {
        var nameExists = await _context.AcademicClasses
            .AnyAsync(c => c.Name == request.Name);

        if (nameExists)
        {
            return Conflict(new
            {
                message = "Academic class already exists."
            });
        }

        var academicClass = new AcademicClass
        {
            Name = request.Name
        };

        _context.AcademicClasses.Add(academicClass);

        await _context.SaveChangesAsync();

        var response = new AcademicClassResponseDto
        {
            Id = academicClass.Id,
            Name = academicClass.Name
        };

        return CreatedAtAction(
            nameof(GetAcademicClass),
            new { id = academicClass.Id },
            response
        );
    }

    // PUT: api/academic-classes/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateAcademicClass(
        int id,
        UpdateAcademicClassDto request)
    {
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == id);

        if (academicClass == null)
        {
            return NotFound(new
            {
                message = "Academic class not found."
            });
        }

        var nameExists = await _context.AcademicClasses
            .AnyAsync(c =>
                c.Name == request.Name &&
                c.Id != id);

        if (nameExists)
        {
            return Conflict(new
            {
                message = "Academic class already exists."
            });
        }

        academicClass.Name = request.Name;

        await _context.SaveChangesAsync();

        return Ok(new AcademicClassResponseDto
        {
            Id = academicClass.Id,
            Name = academicClass.Name
        });
    }

    // DELETE: api/academic-classes/1
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteAcademicClass(int id)
    {
        var academicClass = await _context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Id == id);

        if (academicClass == null)
        {
            return NotFound(new
            {
                message = "Academic class not found."
            });
        }

        _context.AcademicClasses.Remove(academicClass);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}