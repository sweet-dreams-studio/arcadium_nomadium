using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using ArcadeNomadAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArcadeNomadAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class GameLaunchesController : BaseApiController
    {
        private readonly DatabaseContext _context;

        public GameLaunchesController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<GameLaunch>> GetGameLaunches(
            [FromQuery] int? limit,
            [FromQuery] int? offset,
            [FromQuery] string game,
            [FromQuery] int? arcadeId)
        {
            Expression<Func<GameLaunch, bool>> predicate = gameLaunch =>
                (game == null || EF.Functions.Like(gameLaunch.Game.Id, game))
                &&
                (!arcadeId.HasValue || gameLaunch.ArcadeId == arcadeId);

            SetTotalCount(_context.GameLaunches.Count(predicate));

            return _context.GameLaunches
                .Include(l => l.Game)
                .Where(predicate)
                .Skip(offset ?? 0)
                .Take(SecureLimit(limit))
                .ToList();
        }
    }
}