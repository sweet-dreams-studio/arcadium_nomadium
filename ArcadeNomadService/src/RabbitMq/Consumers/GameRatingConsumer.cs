using ArcadeNomadAPI.Services;

namespace ArcadeNomadAPI.RabbitMq.Consumers
{
    public class GameRatingMessage : IMessage
    {
        public int ArcadeId { get; set; }
        
        public string Game { get; set; }

        public int Rating { get; set; }
    }

    public class GameRatingConsumer : BaseConsumer<GameRatingMessage>
    {
        private readonly DatabaseContext _databaseDatabase;
        private readonly GamesService _gamesService;

        public GameRatingConsumer(DatabaseContext databaseContext, GamesService gamesService)
        {
            _databaseDatabase = databaseContext;
            _gamesService = gamesService;
        }

        public override void MessageReceived(GameRatingMessage message)
        {
            var game = _gamesService.GetOrCreate(message.Game);
            game.RatingsCount++;
            game.TotalRating += message.Rating;
            _databaseDatabase.SaveChanges();
        }
    }
}