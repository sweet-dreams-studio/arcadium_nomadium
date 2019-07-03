using System;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ArcadeNomadAPI.RabbitMq
{
    public class RabbitMqListener<TConsumer, TMessage>
        where TMessage : IMessage
        where TConsumer : BaseConsumer<TMessage>
    {
        private readonly RabbitMqService _rabbitMqService;
        private readonly IServiceProvider _serviceProvider;

        public RabbitMqListener(RabbitMqService rabbitMqService, IServiceProvider serviceProvider)
        {
            _rabbitMqService = rabbitMqService;
            _serviceProvider = serviceProvider;
        }

        public void Listen(string queueName)
        {
            var model = _rabbitMqService.Connection.CreateModel();
            var queue = CreateQueue(model, queueName);
            var consumer = new EventingBasicConsumer(model);
            consumer.Received += MessageReceived;
            model.BasicConsume(queue.QueueName, true, consumer);
        }

        private void MessageReceived(object sender, BasicDeliverEventArgs args)
        {
            var body = args.Body;
            var jsonMessage = Encoding.UTF8.GetString(body);
            var convertedMessage = JsonConvert.DeserializeObject<TMessage>(jsonMessage);
            using (var serviceScope = _serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var consumer = serviceScope.ServiceProvider.GetService<TConsumer>();
                consumer?.MessageReceived(convertedMessage);
            }
        }

        private static QueueDeclareOk CreateQueue(IModel model, string queueName) =>
            model.QueueDeclare(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false
            );
    }
}