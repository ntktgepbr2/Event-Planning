using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly TokenService _tokenService;
    private readonly EmailSender _emailSender;

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService, EmailSender emailSender)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailSender = emailSender;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users.Include(u => u.Photos)
            .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

        if (user == null) return Unauthorized("Invalid email");

        if (user.UserName == "tom") user.EmailConfirmed = true;

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return Unauthorized("Invalid password");
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email taken");

            return ValidationProblem();
        }
        if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
        {
            ModelState.AddModelError("userName", "Username taken");

            return ValidationProblem();
        }

        var user = new User
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest("Problem registering user");

        await SendEmailAsync(user);

        return Ok("Registration success - please verify email!");
    }

    [HttpPost("verifyEmail")]
    public async Task<IActionResult> VerifyEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null) return Unauthorized();

        var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded) return BadRequest("Could not verify email");

        return Ok("Email confirmed - you can now login");

    }

    [HttpGet("resendLink")]
    public async Task<IActionResult> ResendConfirmationLink(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null) return Unauthorized();

        await SendEmailAsync(user);

        return Ok("Verification link resent");

    }

    [Authorize]
    [HttpGet()]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await GetUser();

        if (user == null) return Unauthorized();

        return CreateUserDto(user);
    }


    private UserDto CreateUserDto(User user)
    {
        return new UserDto()
        {
            DisplayName = user?.DisplayName,
            Image = user?.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            UserName = user?.UserName,
        };
    }

    private async Task<User> GetUser()
    {
        var user = await _userManager.Users.Include(u => u.Photos)
            .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

        return user;
    }


    private async Task SendEmailAsync(User user)
    {
        var origin = Request.Headers["origin"];
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
        var message =
            $"<p>Please follow link to verify your email:</p><p><a href='{verifyUrl}'>Click to verify email</a></p>";

        await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);
    }
}