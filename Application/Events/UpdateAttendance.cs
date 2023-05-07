using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var userEvent = await _context.Events
                .Include(a => a.Attendees).ThenInclude(u => u.User)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (userEvent == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken);

            if(user == null) return null;

            var hostUserName = userEvent.Attendees.FirstOrDefault(x => x.IsHost)?.User.UserName;

            var attendance = userEvent.Attendees.FirstOrDefault(x => x.User.UserName == user.UserName);

            if (attendance != null && hostUserName == user.UserName)
            {
                userEvent.IsCanceled = !userEvent.IsCanceled;
            }

            if (attendance != null && hostUserName != user.UserName)
            {
                userEvent.Attendees.Remove(attendance);
            }

            if (attendance == null)
            {
                attendance = new EventAttendee
                {
                    User = user,
                    Event = userEvent,
                    IsHost = false
                };

                userEvent.Attendees.Add(attendance);
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return !result ? Result<Unit>.Failure("Failure to update an attendance.") : Result<Unit>.Success(Unit.Value);

        }
    }
}