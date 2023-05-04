using FluentValidation;

namespace API.DTOs;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().Matches("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$");
        RuleFor(x => x.DisplayName).NotEmpty();
        RuleFor(x => x.UserName).NotEmpty();
    }
}