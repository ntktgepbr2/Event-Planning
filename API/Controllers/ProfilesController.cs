using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetUserProfile(string userName, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Details.Query {UserName = userName}, ct));
        }

        [HttpGet("{userName}/events")]
        public async Task<IActionResult> GetUserEvents(string userName,string predicate, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new ListEvents.Query() { UserName = userName, Predicate = predicate}, ct));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile(Profile profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Profile = profile }));
        }
    }
}
