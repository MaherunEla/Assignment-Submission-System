using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class CreateSubmissionDto
{
    [Required]
    public int AssignmentId { get; set; }

    public string? Answer { get; set; }

    public IFormFile? File { get; set; }
}