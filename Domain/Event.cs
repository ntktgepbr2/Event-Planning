namespace Domain;
public class Event
{
public Guid Id { get; set; }
public string Title { get; set; }
public DateTime Date { get; set; }
public string Description { get; set; }
public string Category { get; set; }    
public string City { get; set; }    
public int MaximumAttendees { get; set; }
public bool IsCanceled { get; set; }
public ICollection<EventAttendee> Attendees { get; set; } = new List<EventAttendee>();
public ICollection<Field> Fields { get; set; } = new List<Field>();
public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
