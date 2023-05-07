using Domain;
using FluentValidation;

namespace Application.Events;

public class EventValidator : AbstractValidator<Event>
{
    public EventValidator()
    {
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
    }
}