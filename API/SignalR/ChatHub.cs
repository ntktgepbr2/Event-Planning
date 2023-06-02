using Application.Events;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Create = Application.Comments.Create;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
        var comment = await _mediator.Send(command);

        await Clients.Group(command.EventId.ToString())
            .SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        var httpcontext = Context.GetHttpContext();
        var eventId = httpcontext.Request.Query["eventId"];

        await Groups.AddToGroupAsync(Context.ConnectionId, eventId);

        var result = await _mediator.Send(new Application.Comments.List.Query { EventId = Guid.Parse(eventId) });

        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}