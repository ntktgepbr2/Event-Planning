using AutoMapper;
using Domain;

namespace Application.Mappers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
        }
    }
}