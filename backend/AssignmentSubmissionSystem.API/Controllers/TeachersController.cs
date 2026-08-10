using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Teachers;
using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize(Roles = "Admin")]
public class TeachersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public TeachersController(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    // GET: api/teachers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeacherResponseDto>>> GetTeachers()
    {
        var teachers = await _context.Teachers
            .Include(t => t.User)
            .Select(t => new TeacherResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                FullName = t.User.FullName,
                Email = t.User.Email
            })
            .ToListAsync();

        return Ok(teachers);
    }

    // GET: api/teachers/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeacherResponseDto>> GetTeacher(int id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .Where(t => t.Id == id)
            .Select(t => new TeacherResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                FullName = t.User.FullName,
                Email = t.User.Email
            })
            .FirstOrDefaultAsync();

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Teacher not found."
            });
        }

        return Ok(teacher);
    }

   [HttpPost]
public async Task<ActionResult> CreateTeacher(CreateTeacherDto request)
{
    var emailExists = await _context.Users
        .AnyAsync(u => u.Email == request.Email);

    if (emailExists)
    {
        return Conflict(new
        {
            message = "Email already exists."
        });
    }

    var teacherRole = await _context.Roles
        .FirstOrDefaultAsync(r => r.Name == "Teacher");

    if (teacherRole == null)
    {
        return BadRequest(new
        {
            message = "Teacher role not found."
        });
    }

    var user = new User
    {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = _passwordHasher.HashPassword(request.Password),
        RoleId = teacherRole.Id
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    var teacher = new Teacher
    {
        UserId = user.Id
    };

    _context.Teachers.Add(teacher);

    await _context.SaveChangesAsync();

   return CreatedAtAction(
    nameof(GetTeacher),
    new { id = teacher.Id },
    new
    {
        TeacherId = teacher.Id,
        UserId = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = teacherRole.Name
    });
}
    // PUT: api/teachers/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TeacherResponseDto>> UpdateTeacher(
        int id,
        UpdateTeacherDto request)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Teacher not found."
            });
        }

        var emailExists = await _context.Users
            .AnyAsync(u =>
                u.Email == request.Email &&
                u.Id != teacher.UserId);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Email already exists."
            });
        }

        teacher.User.FullName = request.FullName;
        teacher.User.Email = request.Email;

        await _context.SaveChangesAsync();

        return Ok(new TeacherResponseDto
        {
            Id = teacher.Id,
            UserId = teacher.UserId,
            FullName = teacher.User.FullName,
            Email = teacher.User.Email
        });
    }

    // DELETE: api/teachers/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Teacher not found."
            });
        }

        _context.Teachers.Remove(teacher);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}