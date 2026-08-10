using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.AcademicClasses;

public class UpdateAcademicClassDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}