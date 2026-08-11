namespace AssignmentSubmissionSystem.API.DTOs.Assignments;

public class AssignmentResponseDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime Deadline { get; set; }

    public int MaximumMarks { get; set; }

    public bool IsPublished { get; set; }

    public int TeacherId { get; set; }

    public string TeacherName { get; set; } = string.Empty;

    public int AcademicClassId { get; set; }

    public string AcademicClassName { get; set; } = string.Empty;

    public int SubjectId { get; set; }

    public string SubjectName { get; set; } = string.Empty;
}