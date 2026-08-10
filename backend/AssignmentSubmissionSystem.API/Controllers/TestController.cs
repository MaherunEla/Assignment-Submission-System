using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSubmissionSystem.API.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok("Anyone can access this endpoint.");
    }

    [Authorize]
    [HttpGet("protected")]
    public IActionResult Protected()
    {
        return Ok("You are authenticated!");
    }

    [Authorize(Roles = "Admin")]
     [HttpGet("admin")]
   public IActionResult AdminOnly()
  {
    return Ok("Only Admin can access this endpoint.");
  }
}