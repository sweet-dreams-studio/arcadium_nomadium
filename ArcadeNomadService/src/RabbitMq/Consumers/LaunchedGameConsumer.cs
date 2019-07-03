using System;
using System.Linq;
using ArcadeNomadAPI.Models;
using ArcadeNomadAPI.Services;
using Newtonsoft.Json;

namespace ArcadeNomadAPI.RabbitMq.Consumers
{
    public class GameLaunchedMessage : IMessage
    {
        public int ArcadeId { get; set; }
        
        [JsonRequired]
        public string Game { get; set; }
    }
    
    public class LaunchedGameConsumer : BaseConsumer<GameLaunchedMessage>
    {
        private readonly DatabaseContext _databaseContext;
        private readonly GamesService _gamesService;

        public LaunchedGameConsumer(DatabaseContext databaseContext, GamesService gamesService)
        {
            _databaseContext = databaseContext;
            _gamesService = gamesService;
        }

        public override void MessageReceived(GameLaunchedMessage message)
        {
            var game = _gamesService.GetOrCreate(message.Game);
            var gameLaunch = new GameLaunch
            {
                ArcadeId = message.ArcadeId,
                Game = game,
                DateTime = DateTime.Now
            };
            _databaseContext.GameLaunches.Add(gameLaunch);
            _databaseContext.SaveChanges();
        }
    }
}