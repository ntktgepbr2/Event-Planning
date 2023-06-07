using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class ListEvents
{
    public class Query : IRequest<Result<List<UserEventDto>>>
    {
        public string Predicate { get; set; }
        public string UserName { get; set; }

    }

    public class Handler : IRequestHandler<Query, Result<List<UserEventDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<List<UserEventDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.EventAttendees
                .Include(a => a.Event)
                .Include(a => a.User)
                .Where(a => a.User.UserName == request.UserName)
                .AsQueryable()
                .AsNoTracking();

            query = request.Predicate switch
            {
                "isPast" =>  query.Where(a => a.Event.Date <= DateTime.Now),
                "isHosting" =>  query.Where(a => a.IsHost),
                _ =>  query.Where(a => a.Event.Date >= DateTime.Now)
            };

            var userEvents = await query
                .ProjectTo<UserEventDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<UserEventDto>>.Success(userEvents);
        }
    }
}