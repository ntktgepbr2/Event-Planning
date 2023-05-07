namespace Domain;

public class EventAttendee
{
    public string UserId { get; set; }
    public User User { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; }
    public bool IsHost { get; set; }
}