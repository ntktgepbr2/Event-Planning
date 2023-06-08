using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string FirstName { get; set; }
    public string SecondName { get; set; }
    public string Gender { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string Birthday { get; set; }
    public ICollection<EventAttendee> Events { get; set; }
    public ICollection<Photo> Photos { get; set; }
    public ICollection<UserFollowing> Followings { get; set; }
    public ICollection<UserFollowing> Followers { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

}