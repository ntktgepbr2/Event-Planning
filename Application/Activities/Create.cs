using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
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
                _context.Add(request.Activity);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return !result ? Result<Unit>.Failure("Failure to create an activity.") : Result<Unit>.Success(Unit.Value);
            }
        }
    }
}