using System.ComponentModel.DataAnnotations;
namespace AssignmentSubmissionSystem.API.Models;

public class Subject{
    public int Id {get;set;}
    [Required]
    [MaxLength(50)]
    public string Name {get;set;} = string.Empty;
    public int AcademicClassId {get;set;}
    public AcademicClass AcademicClass{get;set;} = null!;
    public ICollection<Assignment> Assignments {get;set;} = new List<Assignment>();
    public ICollection<TeacherAssignment> TeacherAssignments { get; set; }
    = new List<TeacherAssignment>();
}