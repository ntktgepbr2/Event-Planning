using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Mappers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                    o => o.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).User.UserName));

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio));

            CreateMap<User, Profiles.Profile>().ReverseMap();

            CreateMap<Field, Field>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Value, o => o.MapFrom(s => s.Value))
                .ForMember(d => d.Activity, o => o.Ignore())
                .ForMember(d => d.ActivityId, o => o.Ignore());
        }
    }
}