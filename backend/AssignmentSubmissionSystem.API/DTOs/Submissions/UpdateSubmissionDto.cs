using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class UpdateSubmissionDto
{
    [Required]
    public string Answer { get; set; } = string.Empty;
}