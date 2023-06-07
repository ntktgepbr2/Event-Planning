using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context,
            UserManager<User> userManager)
        {
            if (!userManager.Users.Any() && !context.Events.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    new User
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new User
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }

                var Events = new List<Event>
                {
                    new Event
                    {
                        Title = "Past Event 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Event 2 months ago",
                        Category = "drinks",
                        City = "London",
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = true
                            }
                        }
                    },
                    new Event
                    {
                        Title = "Past Event 2",
                        Date = DateTime.Now.AddMonths(-1),
                        Description = "Event 1 month ago",
                        Category = "culture",
                        City = "Paris",
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 1",
                        Date = DateTime.Now.AddMonths(1),
                        Description = "Event 1 month in future",
                        Category = "music",
                        City = "London",
                     Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[2],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 2",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Event 2 months in future",
                        Category = "food",
                        City = "London",
                             Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 3",
                        Date = DateTime.Now.AddMonths(3),
                        Description = "Event 3 months in future",
                        Category = "drinks",
                        City = "London",
        
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 4",
                        Date = DateTime.Now.AddMonths(4),
                        Description = "Event 4 months in future",
                        Category = "culture",
                        City = "London",
                    
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = true
                            }
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 5",
                        Date = DateTime.Now.AddMonths(5),
                        Description = "Event 5 months in future",
                        Category = "drinks",
                        City = "London",
                 
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 6",
                        Date = DateTime.Now.AddMonths(6),
                        Description = "Event 6 months in future",
                        Category = "music",
                        City = "London",
                 
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[2],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 7",
                        Date = DateTime.Now.AddMonths(7),
                        Description = "Event 7 months in future",
                        Category = "travel",
                        City = "Berlin",
                  
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[0],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[2],
                                IsHost = false
                            },
                        }
                    },
                    new Event
                    {
                        Title = "Future Event 8",
                        Date = DateTime.Now.AddMonths(8),
                        Description = "Event 8 months in future",
                        Category = "drinks",
                        City = "London",
                  
                        Attendees = new List<EventAttendee>
                        {
                            new EventAttendee
                            {
                                User = users[2],
                                IsHost = true
                            },
                            new EventAttendee
                            {
                                User = users[1],
                                IsHost = false
                            },
                        }
                    }
                };

                await context.Events.AddRangeAsync(Events);
                await context.SaveChangesAsync();
            }
        }
    }
}
