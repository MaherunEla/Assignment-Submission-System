using AssignmentSubmissionSystem.API.Data;
using AssignmentSubmissionSystem.API.DTOs.Auth;
using AssignmentSubmissionSystem.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto?> LoginAsync(
        LoginRequestDto request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            return null;
        }

        var passwordValid = _passwordHasher.VerifyPassword(
            user,
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(
            user.Id,
            user.Email,
            user.Role.Name
        );

        return new LoginResponseDto
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.Name
        };
    }

     public async Task<bool> ChangePasswordAsync(
        int userId,
        ChangePasswordDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return false;
        }

        var currentPasswordValid =
            _passwordHasher.VerifyPassword(
                user,
                request.CurrentPassword,
                user.PasswordHash
            );

        if (!currentPasswordValid)
        {
            return false;
        }

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.NewPassword
        );

        await _context.SaveChangesAsync();

        return true;
    }
}