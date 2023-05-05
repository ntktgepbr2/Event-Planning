using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

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
            var activity = await _context.Activities
                .Include(a => a.Attendees).ThenInclude(u => u.User)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (activity == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken);

            if(user == null) return null;

            var hostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.User.UserName;

            var attendance = activity.Attendees.FirstOrDefault(x => x.User.UserName == user.UserName);

            if (attendance != null && hostUserName == user.UserName)
            {
                activity.IsCanceled = !activity.IsCanceled;
            }

            if (attendance != null && hostUserName != user.UserName)
            {
                activity.Attendees.Remove(attendance);
            }

            if (attendance == null)
            {
                attendance = new ActivityAttendee
                {
                    User = user,
                    Activity = activity,
                    IsHost = false
                };

                activity.Attendees.Add(attendance);
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return !result ? Result<Unit>.Failure("Failure to update an attendance.") : Result<Unit>.Success(Unit.Value);

        }
    }
}