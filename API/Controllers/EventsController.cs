using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Events;
using Microsoft.AspNetCore.Authorization;
using static Application.Events.Create;

namespace API.Controllers
{
    public class EventsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetEvents([FromQuery] EventParams param,CancellationToken ct)
        {
            var result = await Mediator.Send(new List.Query{Params = param}, ct);

            return HandlePagedResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(Guid id, CancellationToken ct)
        {
            var result = await Mediator.Send(new Details.Query() { Id = id }, ct);

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent(Event userEvent, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Command() { Event = userEvent }, ct));
        }

        [Authorize(Policy = "IsEventHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditEvent(Guid id, Event userEvent, CancellationToken ct)
        {
            userEvent.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command() { Event = userEvent }, ct));
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