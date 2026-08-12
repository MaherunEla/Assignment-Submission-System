namespace AssignmentSubmissionSystem.API.Models;

public class TeacherAssignment
{
    public int Id { get; set; }

    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;

    public int AcademicClassId { get; set; }
    public AcademicClass AcademicClass { get; set; } = null!;

    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
}