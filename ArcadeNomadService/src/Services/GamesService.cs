using System.Linq;
using ArcadeNomadAPI.Models;

namespace ArcadeNomadAPI.Services
{
    public class GamesService
    {
        private readonly DatabaseContext _databaseContext;

        public GamesService(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public Game GetOrCreate(string id)
        {
            var game = _databaseContext.Games.FirstOrDefault(g => g.Id == id);
            if (game == null)
            {
                game = new Game
                {
                    Id = id,
                    RatingsCount = 0,
                    TotalRating = 0
                };
                game = _databaseContext.Games.Add(game).Entity;
                _databaseContext.SaveChanges();
            }

            return game;
        }
    }
}