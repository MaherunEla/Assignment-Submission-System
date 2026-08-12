namespace AssignmentSubmissionSystem.API.Models;

public class Teacher{
    public int Id {get;set;}

    public int UserId {get;set;}

    public User User {get;set;} = null!;

    public ICollection<TeacherAssignment> TeacherAssignments { get; set; }
    = new List<TeacherAssignment>();

    public ICollection<Assignment> Assignments {get;set;} = new List<Assignment>();
}