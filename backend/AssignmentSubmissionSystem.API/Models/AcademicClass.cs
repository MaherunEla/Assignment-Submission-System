using System.ComponentModel.DataAnnotations;
namespace AssignmentSubmissionSystem.API.Models;

public class AcademicClass{
    public int Id {get; set;}
    [Required]
    [MaxLength(50)]
    public string Name {get;set;} = string.Empty;

    public ICollection<Subject> Subjects {get;set;} = new List<Subject>();

    public ICollection<Assignment> Assignments {get;set;} = new List<Assignment>();
}