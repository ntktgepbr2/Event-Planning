using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Events
{
    public class Details
    {
        public class Query : IRequest<Result<EventDto>>
        {

            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<EventDto>>
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

            public async Task<Result<EventDto>> Handle(Query request, CancellationToken ctx)
            {
                var userEvent = await _context.Events
                    .AsNoTracking()
                    .ProjectTo<EventDto>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName()})
                    .FirstOrDefaultAsync(x => x.Id == request.Id, ctx);


                return Result<EventDto>.Success(userEvent);
            }
        }
    }
}