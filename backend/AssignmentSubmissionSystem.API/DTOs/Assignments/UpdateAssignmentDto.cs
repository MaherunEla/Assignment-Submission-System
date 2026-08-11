using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Assignments;

public class UpdateAssignmentDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Deadline { get; set; }

    [Range(1, 1000)]
    public int MaximumMarks { get; set; }

    public bool IsPublished { get; set; }

    [Required]
    public int TeacherId { get; set; }

    [Required]
    public int AcademicClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }
}