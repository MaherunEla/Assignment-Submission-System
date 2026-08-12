namespace AssignmentSubmissionSystem.API.DTOs.Students;

public class StudentResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string RoleName { get; set; } = string.Empty;

    public int AcademicClassId { get; set; }
    public string AcademicClassName { get; set; } = string.Empty;
}