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

        var teacherRole = await context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Teacher");

        var studentRole = await context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Student");

        if (adminRole == null ||
            teacherRole == null ||
            studentRole == null)
        {
            throw new InvalidOperationException(
                "Required roles were not found."
            );
        }

        // ---------------------------------------------
        // ACADEMIC CLASS
        // ---------------------------------------------

        var academicClass = await context.AcademicClasses
            .FirstOrDefaultAsync(c => c.Name == "Class 10");

        if (academicClass == null)
        {
            academicClass = new AcademicClass
            {
                Name = "Class 10"
            };

            context.AcademicClasses.Add(academicClass);

            await context.SaveChangesAsync();
        }

       

        var adminExists = await context.Users
            .AnyAsync(u => u.Email == "admin@assignment.com");

        if (!adminExists)
        {
            var admin = new User
            {
                FullName = "System Administrator",
                Email = "admin@assignment.com",
                RoleId = adminRole.Id
            };

            admin.PasswordHash =
                passwordHasher.HashPassword(admin, "Admin@123");

            context.Users.Add(admin);
        }

       
        var teacherExists = await context.Users
            .AnyAsync(u => u.Email == "teacher@assignment.com");

        if (!teacherExists)
        {
            var teacherUser = new User
            {
                FullName = "Demo Teacher",
                Email = "teacher@assignment.com",
                RoleId = teacherRole.Id
            };

            teacherUser.PasswordHash =
                passwordHasher.HashPassword(
                    teacherUser,
                    "Teacher@123"
                );

            context.Users.Add(teacherUser);

            await context.SaveChangesAsync();

            var teacherProfileExists = await context.Teachers
                .AnyAsync(t => t.UserId == teacherUser.Id);

            if (!teacherProfileExists)
            {
                var teacher = new Teacher
                {
                    UserId = teacherUser.Id
                };

                context.Teachers.Add(teacher);
            }
        }

        // ---------------------------------------------
        // STUDENT
        // ---------------------------------------------

        var studentExists = await context.Users
            .AnyAsync(u => u.Email == "student@assignment.com");

        if (!studentExists)
        {
            var studentUser = new User
            {
                FullName = "Demo Student",
                Email = "student@assignment.com",
                RoleId = studentRole.Id
            };

            studentUser.PasswordHash =
                passwordHasher.HashPassword(
                    studentUser,
                    "Student@123"
                );

            context.Users.Add(studentUser);

            await context.SaveChangesAsync();

            var studentProfileExists = await context.Students
                .AnyAsync(s => s.UserId == studentUser.Id);

            if (!studentProfileExists)
            {
                var student = new Student
                {
                    UserId = studentUser.Id,
                    AcademicClassId = academicClass.Id
                };

                context.Students.Add(student);
            }
        }

        await context.SaveChangesAsync();
    }
}