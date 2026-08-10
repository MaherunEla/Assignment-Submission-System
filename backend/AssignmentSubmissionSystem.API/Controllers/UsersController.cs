using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Users;
using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using AssignmentSubmissionSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UsersController(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }
    
    [HttpGet]
public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
{
    var users = await _context.Users
        .Include(u => u.Role)
        .Select(u => new UserResponseDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            RoleId = u.RoleId,
            RoleName = u.Role.Name
        })
        .ToListAsync();

    return Ok(users);
}

[HttpGet("{id:int}")]
public async Task<ActionResult<UserResponseDto>> GetUser(int id)
{
    var user = await _context.Users
        .Include(u => u.Role)
        .Where(u => u.Id == id)
        .Select(u => new UserResponseDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            RoleId = u.RoleId,
            RoleName = u.Role.Name
        })
        .FirstOrDefaultAsync();

    if (user == null)
    {
        return NotFound(new
        {
            message = "User not found."
        });
    }

    return Ok(user);
}

    [HttpPost]
public async Task<ActionResult<UserResponseDto>> CreateUser(
    CreateUserDto request)
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

    var role = await _context.Roles
    .FirstOrDefaultAsync(r => r.Id == request.RoleId);

if (role == null)
{
    return BadRequest(new
    {
        message = "Invalid role."
    });
}

if (role.Name == "Teacher" || role.Name == "Student")
{
    return BadRequest(new
    {
        message = $"Use the /api/{role.Name.ToLower()}s endpoint to create a {role.Name.ToLower()}."
    });
}

    var user = new User
    {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = _passwordHasher.HashPassword(request.Password),
        RoleId = request.RoleId
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    var createdUser = await _context.Users
        .Include(u => u.Role)
        .Where(u => u.Id == user.Id)
        .Select(u => new UserResponseDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            RoleId = u.RoleId,
            RoleName = u.Role.Name
        })
        .FirstAsync();

    return CreatedAtAction(
        nameof(GetUser),
        new { id = user.Id },
        createdUser);
}

[HttpPut("{id:int}")]
public async Task<ActionResult<UserResponseDto>> UpdateUser(
    int id,
    UpdateUserDto request)
{
    var user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Id == id);

    if (user == null)
    {
        return NotFound(new
        {
            message = "User not found."
        });
    }

    var emailExists = await _context.Users
        .AnyAsync(u => u.Email == request.Email && u.Id != id);

    if (emailExists)
    {
        return Conflict(new
        {
            message = "Email already exists."
        });
    }

    var roleExists = await _context.Roles
        .AnyAsync(r => r.Id == request.RoleId);

    if (!roleExists)
    {
        return BadRequest(new
        {
            message = "Invalid role."
        });
    }

    user.FullName = request.FullName;
    user.Email = request.Email;
    user.RoleId = request.RoleId;

    await _context.SaveChangesAsync();

    await _context.Entry(user)
        .Reference(u => u.Role)
        .LoadAsync();

    return Ok(new UserResponseDto
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        RoleId = user.RoleId,
        RoleName = user.Role.Name
    });
}

[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteUser(int id)
{
    var user = await _context.Users
        .FindAsync(id);

    if (user == null)
    {
        return NotFound(new
        {
            message = "User not found."
        });
    }

    if (user.Id == 1)
    {
        return BadRequest(new
        {
            message = "The initial administrator cannot be deleted."
        });
    }

    _context.Users.Remove(user);

    await _context.SaveChangesAsync();

    return NoContent();
}

}