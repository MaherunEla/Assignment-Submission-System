using System.Security.Claims;
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
[Authorize]
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
    [Authorize(Roles = "Admin")]
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
            RoleName = s.User.Role.Name,

            AcademicClassId = s.AcademicClassId,
            AcademicClassName = s.AcademicClass.Name
           })
            .ToListAsync();

        return Ok(students);
    }

    // GET: api/students/1
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
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
              RoleName = s.User.Role.Name,

               AcademicClassId = s.AcademicClassId,
               AcademicClassName = s.AcademicClass.Name
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

    [HttpGet("me")]
[Authorize(Roles = "Student")]
public async Task<ActionResult> GetMyProfile()
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

    var student = await _context.Students
        .Include(s => s.User)
        .Include(s => s.AcademicClass)
        .Where(s => s.UserId == userId)
        .Select(s => new
        {
            studentId = s.Id,
            userId = s.UserId,
            fullName = s.User.FullName,
            email = s.User.Email,
            academicClassId = s.AcademicClassId,
            academicClassName = s.AcademicClass.Name
        })
        .FirstOrDefaultAsync();

    if (student == null)
    {
        return NotFound(new
        {
            message = "Student profile not found."
        });
    }

    return Ok(student);
}

[HttpGet("me/assignments")]
[Authorize(Roles = "Student")]
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

    var student = await _context.Students
        .FirstOrDefaultAsync(s => s.UserId == userId);

    if (student == null)
    {
        return NotFound(new
        {
            message = "Student profile not found."
        });
    }

    var assignments = await _context.Assignments
        .Include(a => a.Subject)
        .Where(a =>
            a.AcademicClassId == student.AcademicClassId &&
            a.IsPublished)
        .OrderBy(a => a.Deadline)
        .Select(a => new
        {
            id = a.Id,
            title = a.Title,
            description = a.Description,
            subjectId = a.SubjectId,
            subject = a.Subject.Name,
            deadline = a.Deadline,
            maximumMarks = a.MaximumMarks
        })
        .ToListAsync();

    return Ok(assignments);
}

    // POST: api/students
    [HttpPost]
    [Authorize(Roles = "Admin")]
public async Task<ActionResult> CreateStudent(CreateStudentDto request)
{
    // Check email
    var emailExists = await _context.Users
        .AnyAsync(u => u.Email == request.Email);

    if (emailExists)
    {
        return Conflict(new
        {
            message = "Email already exists."
        });
    }

    // Find Student role
    var studentRole = await _context.Roles
        .FirstOrDefaultAsync(r => r.Name == "Student");

    if (studentRole == null)
    {
        return BadRequest(new
        {
            message = "Student role not found."
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

    // Create User
    var user = new User
    {
        FullName = request.FullName,
        Email = request.Email,
        RoleId = studentRole.Id
    };

    user.PasswordHash = _passwordHasher.HashPassword(
        user,
        request.Password
    );

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    // Create Student profile
    var student = new Student
    {
        UserId = user.Id,
        AcademicClassId = request.AcademicClassId
    };

    _context.Students.Add(student);

    await _context.SaveChangesAsync();

    var response = new StudentResponseDto
    {
        Id = student.Id,
        UserId = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        RoleName = studentRole.Name,
        AcademicClassId = academicClass.Id,
        AcademicClassName = academicClass.Name
    };

    return CreatedAtAction(
        nameof(GetStudent),
        new { id = student.Id },
        response
    );
}
    // PUT: api/students/1
[HttpPut("{id:int}")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult> UpdateStudent(
    int id,
    UpdateStudentDto request)
{
    var student = await _context.Students
        .Include(s => s.User)
        .Include(s => s.AcademicClass)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (student == null)
    {
        return NotFound(new
        {
            message = "Student not found."
        });
    }

    // Check email
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

    // Check academic class
    var academicClass = await _context.AcademicClasses
        .FirstOrDefaultAsync(c => c.Id == request.AcademicClassId);

    if (academicClass == null)
    {
        return BadRequest(new
        {
            message = "Academic class not found."
        });
    }

    // Update User
    student.User.FullName = request.FullName;
    student.User.Email = request.Email;

    // Update Student
    student.AcademicClassId = request.AcademicClassId;

    await _context.SaveChangesAsync();

    return Ok(new StudentResponseDto
    {
        Id = student.Id,
        UserId = student.UserId,
        FullName = student.User.FullName,
        Email = student.User.Email,
        RoleName = "Student",
        AcademicClassId = academicClass.Id,
        AcademicClassName = academicClass.Name
    });
}

    // DELETE: api/students/1
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
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

