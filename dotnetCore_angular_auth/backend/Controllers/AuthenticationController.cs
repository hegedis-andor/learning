using System.Threading.Tasks;
using backend.Models.ViewModels;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;

        public AuthenticationController(IUserService userService, IJwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] RegistrationViewModel model)
        {
           if (!ModelState.IsValid)
               return BadRequest(new { code = "ModelNotValid", description = "Model is not valid." });
           
           if (_userService.UserNameTaken(model.UserName))
               return BadRequest(new { code = "UserNameTaken", description = $"The User Name {model.UserName} is taken." });
           
           var identityResult = await _userService.CreateUserAsync(model);
           
           if (!identityResult.Succeeded)
               return BadRequest(identityResult.Errors);
           
           var user = _userService.GetUserByUserName(model.UserName);
           int validityDurationInHours = 3;
           string token = _jwtService.GenerateJwtToken(user, await _userService.GetUserRolesAsync(user), validityDurationInHours);
            
            return Ok(new { code = "RegistrationSuccess", auth_token = token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
           if (!ModelState.IsValid)
               return BadRequest(new { code = "ModelNotValid", description = "Model is not valid." });
           
           if (!await _userService.CheckLoginCredentialsValidityAsync(model))
               return BadRequest(new { code = "LoginCredentialsInvalid", description = "Login credentials are not valid." });
           
           var user = _userService.GetUserByUserName(model.UserName);
           int validityDurationInHours = 3;
           string token = _jwtService.GenerateJwtToken(user, await _userService.GetUserRolesAsync(user), validityDurationInHours);
           
            return Ok(new { code = "LoginSuccess", auth_token = token });
        }

    }
}
