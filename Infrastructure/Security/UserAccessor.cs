using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security;

public class UserAccessor : IUserAccessor
{
    private readonly IHttpContextAccessor _contextAccessor;

    public UserAccessor(IHttpContextAccessor contextAccessor)
    {
        _contextAccessor = contextAccessor;
    }
    public string GetUserName()
    {
        return _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
    }

    public string GetUserEmail()
    {
        return _contextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
    }
}