﻿using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null) return Unauthorized();

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            return BadRequest("Email taken.");
        }
        if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
        {
            return BadRequest("User name taken.");
        }

        var user = new User
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return BadRequest("Problem with register new user.");
    }



    [Authorize]
    [HttpGet()]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
        var user = await _userManager.FindByEmailAsync(email);

        return CreateUserDto(user);
    }

    private UserDto CreateUserDto(User user)
    {
        return new UserDto()
        {
            DisplayName = user.DisplayName,
            Image = null,
            Token = _tokenService.CreateToken(user),
            UserName = user.UserName,
        };
    }
}