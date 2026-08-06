using System.ComponentModel.DataAnnotations;
namespace AssignmentSubmissionSystem.API.Models;


public class User{
    public int Id {get;set;}
    [Required]
    [MaxLength(100)]
    public string FullName {get;set;} = string.Empty;
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email {get;set;} = string.Empty;

    [Required]
    [MaxLength(255)]

    public string PasswordHash {get;set;} = string.Empty;

    public int RoleId {get;set;}

    public Role Role {get;set;} = null!;

    public Teacher? Teacher {get;set;}

    public Student? Student {get;set;}
}