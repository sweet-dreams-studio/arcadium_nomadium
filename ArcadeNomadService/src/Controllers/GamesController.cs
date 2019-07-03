using System.Threading.Tasks;
using ArcadeNomadAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeNomadAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class GamesController
    {
        private readonly DatabaseContext _databaseContext;

        public GamesController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(string id)
        {
            var game = await _databaseContext.Games.FindAsync(id);
            if (game == null)
            {
                return new NotFoundResult();
            }

            return game;
        }
    }
}