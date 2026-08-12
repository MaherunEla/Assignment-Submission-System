using System.Security.Claims;
using AssignmentSubmissionSystem.API.DTOs.Auth;
using AssignmentSubmissionSystem.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(result);
    }

   [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword(
        ChangePasswordDto request)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (string.IsNullOrEmpty(userIdClaim) ||
            !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var result = await _authService.ChangePasswordAsync(
            userId,
            request
        );

        if (!result)
        {
            return BadRequest(new
            {
                message = "Current password is incorrect."
            });
        }

        return Ok(new
        {
            message = "Password changed successfully."
        });
    }

    
}