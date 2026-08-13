using AssignmentSubmissionSystem.API.Enums;

namespace AssignmentSubmissionSystem.API.Models;

public class Submission
{
    public int Id { get; set; }

   public string? Answer { get; set; }

    public DateTime SubmittedAt { get; set; }

    public int? Marks { get; set; }

    public string? Feedback { get; set; }

    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

    // File information
    public string? FileName { get; set; }

    public string? FilePath { get; set; }

    public string? FileContentType { get; set; }

    public long? FileSize { get; set; }

    public int AssignmentId { get; set; }

    public Assignment Assignment { get; set; } = null!;

    public int StudentId { get; set; }

    public Student Student { get; set; } = null!;
}