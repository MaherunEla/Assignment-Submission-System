using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.AcademicClasses;

public class CreateAcademicClassDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}