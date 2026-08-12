using AssignmentSubmissionSystem.API.Interfaces;
using AssignmentSubmissionSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        await context.Database.MigrateAsync();

        var adminRole = await context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Admin");

        if (adminRole == null)
        {
            throw new InvalidOperationException(
                "Admin role was not found."
            );
        }

        var adminExists = await context.Users
            .AnyAsync(u => u.Email == "admin@assignment.com");

        if (adminExists)
        {
            return;
        }

        var admin = new User
        {
            FullName = "System Administrator",
            Email = "admin@assignment.com",
            RoleId = adminRole.Id,
           
        };

        admin.PasswordHash = passwordHasher.HashPassword( admin, "Admin@123");

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}