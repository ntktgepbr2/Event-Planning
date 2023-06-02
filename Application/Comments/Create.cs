using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public Guid EventId { get; set; }
            public string Body { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userEvent = await _context.Events.FindAsync(request.EventId, cancellationToken);

                if (userEvent == null) return null;

                var user = await _context.Users
                    .Include(u => u.Photos.Where(p => p.IsMain))
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken);

                var comment = new Comment { Author = user, Event = userEvent, Body = request.Body };

                _context.Comments.Add(comment);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                return !result ? Result<CommentDto>.Failure("Failed to add a comment") : Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
            }
        }
    }
}