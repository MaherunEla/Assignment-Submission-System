using AssignmentSubmissionSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.API.Data;

public class ApplicationDbContext : DbContext {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext>options):base(options){

    }

    public DbSet<Role> Roles {get;set;}

    public DbSet<User> Users {get;set;}

    public DbSet<Teacher> Teachers {get;set;}

    public DbSet<Student> Students {get;set;}

    public DbSet<AcademicClass> AcademicClasses {get;set;}

    public DbSet<Subject> Subjects {get;set;}

    public DbSet<Assignment> Assignments {get;set;}

    public DbSet<Submission> Submissions {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();

        modelBuilder.Entity<User>()
        .HasOne(u=>u.Role)
        .WithMany(r=>r.Users)
        .HasForeignKey(u=>u.RoleId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Teacher>()
        .HasOne(t=> t.User)
        .WithOne(u=> u.Teacher)
        .HasForeignKey<Teacher>(t=> t.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Student>()
        .HasOne(s=> s.User)
        .WithOne(u=>u.Student)
        .HasForeignKey<Student>(s=>s.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Assignment>()
        .HasOne(a=>a.Teacher)
        .WithMany(t=>t.Assignments)
        .HasForeignKey(a=> a.TeacherId)
        .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Assignment>()
    .HasOne(a => a.AcademicClass)
    .WithMany(c => c.Assignments)
    .HasForeignKey(a => a.AcademicClassId)
    .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Assignment>()
    .HasOne(a => a.Subject)
    .WithMany(s => s.Assignments)
    .HasForeignKey(a => a.SubjectId)
    .OnDelete(DeleteBehavior.Restrict);


    modelBuilder.Entity<Submission>()
    .HasOne(s => s.Assignment)
    .WithMany(a => a.Submissions)
    .HasForeignKey(s => s.AssignmentId)
    .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Submission>()
    .HasOne(s => s.Student)
    .WithMany(st => st.Submissions)
    .HasForeignKey(s => s.StudentId)
    .OnDelete(DeleteBehavior.Cascade);
    }
}