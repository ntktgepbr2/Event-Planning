using Domain;

namespace Application.Events;

public class EventDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string City { get; set; }
    public int MaximumAttendees { get; set; }
    public string HostUserName { get; set; }
    public bool IsCanceled { get; set; }
    public ICollection<EventAttendeeDto> Attendees { get; set; } = new List<EventAttendeeDto>();
    public ICollection<Field> Fields { get; set; } = new List<Field>();
}