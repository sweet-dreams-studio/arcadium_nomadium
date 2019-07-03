using System;
using ArcadeNomadAPI.RabbitMq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;

namespace ArcadeNomadAPI
{
    public static class RabbitMqListenersFactory
    {
        private delegate void OnStartEventHandler(IServiceProvider serviceProvider);
        
        private static event OnStartEventHandler OnStart;

        public static IServiceCollection UseRabbitMq(this IServiceCollection services, ConnectionFactory connectionFactory)
        {
            services.AddSingleton(provider => new RabbitMqService(connectionFactory));
            return services;
        }

        public static IApplicationBuilder UseRabbitMq(this IApplicationBuilder app)
        {
            var lifetime = app.ApplicationServices.GetService<IApplicationLifetime>();
            lifetime.ApplicationStarted.Register(() => OnStart?.Invoke(app.ApplicationServices));
            return app;
        }

        public static IServiceCollection AddRabbitMqListener<TConsumer, TMessage>(this IServiceCollection services, string queueName)
            where TMessage : IMessage
            where TConsumer : BaseConsumer<TMessage>
        {
            services.AddSingleton<RabbitMqListener<TConsumer, TMessage>>();
            services.AddScoped<TConsumer>();
            OnStart += (serviceProvider) =>
            {
                var listener = serviceProvider.GetService<RabbitMqListener<TConsumer, TMessage>>();
                listener.Listen(queueName);
            };
            return services;
        }
    }
}