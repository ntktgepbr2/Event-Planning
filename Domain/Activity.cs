namespace Domain;
public class Activity
{
public Guid Id { get; set; }
public string Title { get; set; }
public DateTime Date { get; set; }
public string Description { get; set; }
public string Category { get; set; }    
public string City { get; set; }    
public int MaximumAttendees { get; set; }
public bool IsCanceled { get; set; }
public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
public ICollection<Field> Fields { get; set; } = new List<Field>();
}
