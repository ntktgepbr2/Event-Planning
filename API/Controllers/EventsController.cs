using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using static Application.Activities.Create;

namespace API.Controllers
{
    public class EventsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetEvents(CancellationToken ct)
        {
            var result = await Mediator.Send(new List.Query(), ct);

            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(Guid id, CancellationToken ct)
        {
            var result = await Mediator.Send(new Details.Query() { Id = id }, ct);

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent(Activity activity, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Command() { Activity = activity }, ct));
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEvent(Guid id, Activity activity, CancellationToken ct)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command() { Activity = activity }, ct));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Delete.Command() { Id = id }, ct));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }, ct));
        }
    }
}