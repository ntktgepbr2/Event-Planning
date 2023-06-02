using Application.Core;
using MediatR;
using Persistence;

namespace Application.Events
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userEvent = await _context.Events.FindAsync(new object[] { request.Id }, cancellationToken: cancellationToken);

                if (userEvent == null) return null;

                _context.Events.Remove(userEvent);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return !result ? Result<Unit>.Failure("Failed to delete Event.") : Result<Unit>.Success(Unit.Value);
            }
        }
    }
}