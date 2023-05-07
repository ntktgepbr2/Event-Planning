namespace Domain;

public class Field
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public Guid ActivityId { get; set; }
    public Activity Activity { get; set; }
}