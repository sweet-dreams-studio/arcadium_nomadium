using ArcadeNomadAPI.RabbitMq.Consumers;
using ArcadeNomadAPI.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;

namespace ArcadeNomadAPI
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        private IConfigurationSection _rabbitMqConfiguration => _configuration.GetSection("rabbitMQ");

        private IConfigurationSection _queueNames => _rabbitMqConfiguration.GetSection("queueNames");

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services
                .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie();

            services.AddScoped<GamesService>();

            services
                .UseRabbitMq(new ConnectionFactory
                {
                    HostName = _rabbitMqConfiguration["ip"],
                    UserName = _rabbitMqConfiguration["login"],
                    Password = _rabbitMqConfiguration["password"]
                })
                .AddRabbitMqListener<LaunchedGameConsumer, GameLaunchedMessage>(_queueNames["gameLaunched"])
                .AddRabbitMqListener<GameRatingConsumer, GameRatingMessage>(_queueNames["gameRating"]);

            var connectionString = _configuration["postgresql"];
            services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseMvc();

            app.UseRabbitMq();

            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<DatabaseContext>();
                context.Database.EnsureCreated();
            }
        }
    }
}