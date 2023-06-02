using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<EventDto>>>
        {
            public EventParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<EventDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<EventDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Events
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<EventDto>(_mapper.ConfigurationProvider,
                        new {currentUserName = _userAccessor.GetUserName()})
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.HostUserName == _userAccessor.GetUserName());
                }

                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
                }

                var pagedEvents =
                    await PagedList<EventDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize);

                return Result<PagedList<EventDto>>.Success(pagedEvents);
            }
        }
    }
}