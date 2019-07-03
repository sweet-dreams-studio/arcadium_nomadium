using ArcadeNomadAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArcadeNomadAPI
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }

        public DbSet<GameLaunch> GameLaunches { get; set; }
    }
}