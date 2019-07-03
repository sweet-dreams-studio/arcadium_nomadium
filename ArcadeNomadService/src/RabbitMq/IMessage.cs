using Newtonsoft.Json;

namespace ArcadeNomadAPI.RabbitMq
{
    public interface IMessage
    {
        [JsonRequired]
        int ArcadeId { get; set; }
    }
}