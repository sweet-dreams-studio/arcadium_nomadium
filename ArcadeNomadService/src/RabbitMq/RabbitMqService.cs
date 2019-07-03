using System;
using RabbitMQ.Client;

namespace ArcadeNomadAPI.RabbitMq
{
    public class RabbitMqService : IDisposable
    {
        public IConnection Connection { get; }

        public RabbitMqService(IConnectionFactory connectionFactory)
        {
            Connection = connectionFactory.CreateConnection();
        }

        public void Dispose()
        {
            Connection.Dispose();
        }
    }
}