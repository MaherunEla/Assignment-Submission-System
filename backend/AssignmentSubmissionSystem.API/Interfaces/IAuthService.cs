using AssignmentSubmissionSystem.API.DTOs.Auth;

namespace AssignmentSubmissionSystem.API.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}