using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Students;
using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using AssignmentSubmissionSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/students")]
[Authorize(Roles = "Admin")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public StudentsController(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    // GET: api/students
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudents()
    {
        var students = await _context.Students
            .Include(s => s.User)
            .ThenInclude(u => u.Role)
            .Select(s => new StudentResponseDto
            {
                Id = s.Id,
                UserId = s.UserId,
                FullName = s.User.FullName,
                Email = s.User.Email,
                RoleName = s.User.Role.Name
            })
            .ToListAsync();

        return Ok(students);
    }

    // GET: api/students/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<StudentResponseDto>> GetStudent(int id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .ThenInclude(u => u.Role)
            .Where(s => s.Id == id)
            .Select(s => new StudentResponseDto
            {
                Id = s.Id,
                UserId = s.UserId,
                FullName = s.User.FullName,
                Email = s.User.Email,
                RoleName = s.User.Role.Name
            })
            .FirstOrDefaultAsync();

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student not found."
            });
        }

        return Ok(student);
    }

    // POST: api/students
    [HttpPost]
    public async Task<ActionResult> CreateStudent(CreateStudentDto request)
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

        var studentRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Student");

        if (studentRole == null)
        {
            return BadRequest(new
            {
                message = "Student role not found."
            });
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            RoleId = studentRole.Id
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var student = new Student
        {
            UserId = user.Id
        };

        _context.Students.Add(student);

        await _context.SaveChangesAsync();

        var response = new StudentResponseDto
        {
            Id = student.Id,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            RoleName = studentRole.Name
        };

        return CreatedAtAction(
            nameof(GetStudent),
            new { id = student.Id },
            response
        );
    }

    // PUT: api/students/1
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateStudent(
        int id,
        UpdateStudentDto request)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student not found."
            });
        }

        var emailExists = await _context.Users
            .AnyAsync(u =>
                u.Email == request.Email &&
                u.Id != student.UserId);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "Email already exists."
            });
        }

        student.User.FullName = request.FullName;
        student.User.Email = request.Email;

        await _context.SaveChangesAsync();

        return Ok(new StudentResponseDto
        {
            Id = student.Id,
            UserId = student.UserId,
            FullName = student.User.FullName,
            Email = student.User.Email,
            RoleName = "Student"
        });
    }

    // DELETE: api/students/1
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Student not found."
            });
        }

        _context.Students.Remove(student);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}