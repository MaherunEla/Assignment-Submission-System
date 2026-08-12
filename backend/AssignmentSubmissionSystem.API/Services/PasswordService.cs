using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.AspNetCore.Identity;

namespace AssignmentSubmissionSystem.API.Services;

public class PasswordService : IPasswordHasher
{
    private readonly Microsoft.AspNetCore.Identity.IPasswordHasher<User>
        _passwordHasher;

    public PasswordService(
        Microsoft.AspNetCore.Identity.IPasswordHasher<User> passwordHasher)
    {
        _passwordHasher = passwordHasher;
    }

    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(
        User user,
        string password,
        string passwordHash)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            user,
            passwordHash,
            password
        );

        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}