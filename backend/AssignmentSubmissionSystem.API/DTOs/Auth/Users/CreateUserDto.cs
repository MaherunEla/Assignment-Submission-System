using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.API.DTOs.Users;

public class CreateUserDto
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public int RoleId { get; set; }
}