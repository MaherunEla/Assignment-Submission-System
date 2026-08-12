using AssignmentSubmissionSystem.API.Enums;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class SubmissionResponseDto
{
    public int Id { get; set; }

    public string Answer { get; set; } = string.Empty;

    public DateTime SubmittedAt { get; set; }

    public int? Marks { get; set; }

    public string? Feedback { get; set; }

    public SubmissionStatus Status { get; set; }

    public int AssignmentId { get; set; }

    public string AssignmentTitle { get; set; } = string.Empty;

    public int StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;
}