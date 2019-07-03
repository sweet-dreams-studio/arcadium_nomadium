using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ArcadeNomadAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ArcadeNomadAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly IConfiguration _configuration;

        private IConfigurationSection _authenticationsConfig => _configuration.GetSection("authentication");

        public AccountController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Route("login")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] AuthCredentials credentials)
        {
            if (!ValidateLogin(credentials.Login, credentials.Password)) return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, credentials.Login),
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    IssuedUtc = DateTimeOffset.UtcNow,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
                });

            return Ok();
        }

        [Route("logout")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Ok();
        }

        private bool ValidateLogin(string login, string password)
        {
            return login == _authenticationsConfig["login"] && password == _authenticationsConfig["password"];
        }
    }
}