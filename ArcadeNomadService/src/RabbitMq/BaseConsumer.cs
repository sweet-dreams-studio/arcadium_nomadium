namespace ArcadeNomadAPI.RabbitMq
{   
    public abstract class BaseConsumer<TMessage> where TMessage : IMessage
    {
        public abstract void MessageReceived(TMessage message);
    }
}