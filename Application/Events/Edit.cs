using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Events
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Event Event { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userEvent = await _context.Events.FindAsync(new object[] { request.Event.Id }, cancellationToken: cancellationToken);

                if (userEvent == null) return null;

                _mapper.Map(request.Event, userEvent);

                foreach (var field in userEvent.Fields)
                {
                    field.Event = userEvent;
                    field.EventId = userEvent.Id;
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return !result ? Result<Unit>.Failure("Failed to update Event.") : Result<Unit>.Success(Unit.Value);
            }
        }
    }
}