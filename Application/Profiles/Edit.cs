using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Edit
{
    public class Command : IRequest<Result<Unit>>
    {
        public Profile Profile { get; set; }
    }
    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken ctx)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == request.Profile.UserName, ctx);

            _mapper.Map(request.Profile, user);

            var result = await _context.SaveChangesAsync(ctx) > 0;

            return !result ? Result<Unit>.Failure("Failed to update Profile.") : Result<Unit>.Success(Unit.Value);
        }
    }
}