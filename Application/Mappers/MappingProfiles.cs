using Application.Comments;
using Application.Events;
using Application.Profiles;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Mappers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Event, Event>();
            CreateMap<Event, EventDto>()
                .ForMember(d => d.HostUserName,
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).User.UserName));

            CreateMap<EventAttendee, EventAttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.User.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.User.Followings.Count))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.User.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<EventAttendee, UserEventDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.EventId))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Event.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Event.Category))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Event.Date))
                .ForMember(d => d.HostUserName, o => o.MapFrom(s => s.User.Events.FirstOrDefault(e => e.IsHost).User.UserName));

            CreateMap<User, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<Profiles.Profile,User >()
                .ForMember(d => d.Photos, o => o.Ignore());

            CreateMap<Field, Field>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Value, o => o.MapFrom(s => s.Value))
                .ForMember(d => d.Event, o => o.Ignore())
                .ForMember(d => d.EventId, o => o.Ignore());

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}