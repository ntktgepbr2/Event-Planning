﻿using Domain;

namespace Application.Profiles;

public class Profile
{
    public string DisplayName { get; set; }
    public string UserName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public string FirstName { get; set; }
    public string SecondName { get; set; }
    public string Gender { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string Birthday { get; set; }
    public bool Following { get; set; }
    public int FollowingCount { get; set; }
    public int FollowersCount { get; set; }
    public ICollection<Photo> Photos { get; set; }
}