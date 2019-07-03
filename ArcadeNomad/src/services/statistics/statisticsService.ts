import { ConfigurationService } from "../configuration/configuration";
import { IRabbitMQPublishResponse, RabbitMqService } from "./rabbitMqService";
import { Inject, Singleton } from "typescript-ioc";

@Singleton
export class StatisticsService {

  @Inject private rabbitMqService: RabbitMqService;
  @Inject private configurationService: ConfigurationService;

  public async connect(): Promise<boolean> {
    const { connected } = await this.rabbitMqService.connect();
    return connected;
  }

  public async disconnect(): Promise<void> {
    if (this.rabbitMqService.connected) {
      await this.rabbitMqService.disconnect();
    }
  }

  public publish<T>(queueName: string, message: T): IRabbitMQPublishResponse {
    const payload = {
      ...message,
      arcadeId: this.configurationService.configuration.arcadeId
    };
    console.log(payload)
    return this.rabbitMqService.publish(queueName, payload);
  }

}
