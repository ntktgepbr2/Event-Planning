namespace Domain;

public class Field
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public Guid EventId { get; set; }
    public Event Event { get; set; }
}