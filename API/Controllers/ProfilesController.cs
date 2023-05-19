using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetUserProfile(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query {UserName = userName}));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile(Profile profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Profile = profile }));
        }
    }
}
