using Microsoft.AspNetCore.Http;

namespace AssignmentSubmissionSystem.API.DTOs.Submissions;

public class UpdateSubmissionDto
{
    public string? Answer { get; set; }

    public IFormFile? File { get; set; }
}