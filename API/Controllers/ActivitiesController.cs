using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using static Application.Activities.Create;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities(CancellationToken ct)
        {
            var result = await Mediator.Send(new List.Query(), ct);

            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivities(Guid id, CancellationToken ct)
        {
            var result = await Mediator.Send(new Details.Query() { Id = id }, ct);

            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Command() { Activity = activity }, ct));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity, CancellationToken ct)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command() { Activity = activity }, ct));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id, CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new Delete.Command() { Id = id }, ct));
        }
    }
}