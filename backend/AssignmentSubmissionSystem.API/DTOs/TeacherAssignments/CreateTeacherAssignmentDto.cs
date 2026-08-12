using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.TeacherAssignments;

public class CreateTeacherAssignmentDto
{
    [Required]
    public int TeacherId { get; set; }

    [Required]
    public int AcademicClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }
}