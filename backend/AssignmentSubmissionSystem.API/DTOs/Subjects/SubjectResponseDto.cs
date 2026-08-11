namespace AssignmentSubmissionSystem.API.DTOs.Subjects;

public class SubjectResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int AcademicClassId { get; set; }

    public string AcademicClassName { get; set; } = string.Empty;
}