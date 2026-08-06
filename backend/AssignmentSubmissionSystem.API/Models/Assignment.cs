using System.ComponentModel.DataAnnotations;
namespace AssignmentSubmissionSystem.API.Models;

public class Assignment{
    public int Id {get;set;}
    [Required]
    [MaxLength(200)]
    public string Title {get;set;} = string.Empty;
    [Required]
    public string Description {get;set;} = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime Deadline {get;set;}
    [Range(1, 1000)]
    public int MaximumMarks {get;set;}

    public bool IsPublished {get;set;}

    public int TeacherId {get;set;}

    public Teacher Teacher {get;set;} = null!;

    public int AcademicClassId {get; set;}

    public AcademicClass AcademicClass {get;set;}=null!;

    public int SubjectId {get;set;}

    public Subject Subject {get;set;} = null!;

    public ICollection<Submission> Submissions {get;set;} = new List<Submission>();
}