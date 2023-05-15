using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        }
    }
}