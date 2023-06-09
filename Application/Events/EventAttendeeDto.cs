﻿namespace Application.Events;

public class EventAttendeeDto
{
    public string DisplayName { get; set; }
    public string UserName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public bool Following { get; set; }
    public int FollowingCount { get; set; }
    public int FollowersCount { get; set; }
}