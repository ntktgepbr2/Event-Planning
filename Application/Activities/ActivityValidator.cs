using Domain;
using FluentValidation;

namespace Application.Activities;

public class ActivityValidator : AbstractValidator<Activity>
{
    public ActivityValidator()
    {
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
    }
}