namespace AssignmentSubmissionSystem.API.Models;
using AssignmentSubmissionSystem.API.Enums;

public class Submission{
    public int Id {get;set;}

    public string Answer {get;set;} = string.Empty;

    public DateTime SubmittedAt {get;set;}

    public int? Marks {get;set;}

    public string? Feedback {get;set;}

   public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

    public int AssignmentId {get;set;}

    public Assignment Assignment {get;set;} = null!;

    public int StudentId {get;set;}

    public Student Student {get;set;} = null!;
}