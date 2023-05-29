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
        public class Query : IRequest<Result<List<EventDto>>>{}

        public class Handler : IRequestHandler<Query, Result<List<EventDto>>>
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

            public async Task<Result<List<EventDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userEvents = await _context.Events
                    .AsNoTracking()
                    .ProjectTo<EventDto>(_mapper.ConfigurationProvider, new{currentUserName = _userAccessor.GetUserName()})
                    .ToListAsync(cancellationToken);

                return Result<List<EventDto>>.Success(userEvents);
            }
        }
    }
}