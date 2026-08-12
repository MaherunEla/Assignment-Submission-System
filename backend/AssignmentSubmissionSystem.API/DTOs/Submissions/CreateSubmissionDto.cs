using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class CreateSubmissionDto
{
    [Required]
    public string Answer { get; set; } = string.Empty;

    [Required]
    public int AssignmentId { get; set; }
}