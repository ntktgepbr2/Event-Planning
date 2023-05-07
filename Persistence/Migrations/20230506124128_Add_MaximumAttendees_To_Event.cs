﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_MaximumAttendees_To_Event : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Venue",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "MaximumAttendees",
                table: "Events",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaximumAttendees",
                table: "Events");

            migrationBuilder.AddColumn<string>(
                name: "Venue",
                table: "Events",
                type: "TEXT",
                nullable: true);
        }
    }
}
