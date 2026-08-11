using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Subjects;

public class CreateSubjectDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int AcademicClassId { get; set; }
}