namespace AssignmentSubmissionSystem.API.Models;

public class Student{
    public int Id {get;set;}

    public int UserId {get;set;}

    public User User {get;set;} = null!;

    public int AcademicClassId { get; set; }

    public AcademicClass AcademicClass { get; set; } = null!;

    public ICollection<Submission>Submissions {get;set;} = new List<Submission>();
}