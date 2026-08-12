using AssignmentSubmissionSystem.API.DTOs.Auth;

namespace AssignmentSubmissionSystem.API.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);

      Task<bool> ChangePasswordAsync(
        int userId,
        ChangePasswordDto request);
}