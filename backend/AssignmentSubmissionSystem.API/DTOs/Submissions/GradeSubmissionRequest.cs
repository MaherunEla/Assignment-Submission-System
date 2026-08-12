using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class GradeSubmissionRequest
{
    [Range(0, 1000)]
    public int Marks { get; set; }

    [MaxLength(1000)]
    public string? Feedback { get; set; }
}