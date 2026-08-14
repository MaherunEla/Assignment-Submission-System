using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Teachers;
using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize]
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
    [Authorize(Roles = "Admin")]
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
// =========================================================
// GET MY ASSIGNMENTS
// Teacher
// =========================================================

[HttpGet("me/assignments")]
[Authorize(Roles = "Teacher")]
public async Task<ActionResult> GetMyAssignments()
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

    // Find logged-in teacher
    var teacher = await _context.Teachers
        .FirstOrDefaultAsync(t => t.UserId == userId);

    if (teacher == null)
    {
        return NotFound(new
        {
            message = "Teacher profile not found."
        });
    }

    // Get assignments created by this teacher
    var assignments = await _context.Assignments
        .Include(a => a.Subject)
        .Include(a => a.AcademicClass)
        .Where(a => a.TeacherId == teacher.Id)
        .OrderBy(a => a.Deadline)
        .Select(a => new
        {
            id = a.Id,
            title = a.Title,
            description = a.Description,

            subjectId = a.SubjectId,
            subject = a.Subject.Name,

            academicClassId = a.AcademicClassId,
            academicClassName = a.AcademicClass.Name,

            deadline = a.Deadline,
            maximumMarks = a.MaximumMarks,
            isPublished = a.IsPublished
        })
        .ToListAsync();

    return Ok(assignments);
}


    // GET: api/teachers/1
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
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
   [Authorize(Roles = "Admin")]
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
        RoleId = teacherRole.Id
    };

    user.PasswordHash = _passwordHasher.HashPassword(
    user,
    request.Password);

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
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
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

