using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventAttendee> EventAttendees { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<EventAttendee>(x => x.HasKey(aa => new {aa.EventId, aa.UserId}));

            builder.Entity<EventAttendee>()
                .HasOne(u => u.User)
                .WithMany(a => a.Events)
                .HasForeignKey(u => u.UserId);

            builder.Entity<EventAttendee>()
                .HasOne(u => u.Event)
                .WithMany(a => a.Attendees)
                .HasForeignKey(u => u.EventId);

            builder.Entity<Field>()
                .HasOne(a => a.Event)
                .WithMany(f => f.Fields)
                .HasForeignKey(f => f.EventId);

            builder.Entity<Comment>()
                .HasOne(a => a.Event)
                .WithMany(f => f.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new {k.ObserverId, k.TargetId});

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}