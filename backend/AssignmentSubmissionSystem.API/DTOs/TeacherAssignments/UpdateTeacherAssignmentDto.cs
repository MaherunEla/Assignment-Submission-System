using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.TeacherAssignments;

public class UpdateTeacherAssignmentDto
{
    [Required]
    public int TeacherId { get; set; }

    [Required]
    public int AcademicClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }
}