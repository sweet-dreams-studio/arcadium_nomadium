import { StatisticsService } from "./statisticsService";
import { Container, Inject, Provider} from "typescript-ioc";
import { ConfigurationService, IConfiguration } from "../configuration/configuration";
import { IRabbitMQPublishResponse } from "./rabbitMqService";

export abstract class BasePublisher<T> {

  @Inject private readonly statisticsService: StatisticsService;
  @Inject private readonly configurationService: ConfigurationService;

  constructor(private queueName: string) {

  }

  public publish(message: T): IRabbitMQPublishResponse {
    if (this.configurationService.configuration.service.enabled) {
      return this.statisticsService.publish(this.queueName, message);
    }
    return null;
  }

}

export function createPublisherProvider<T>(
  publisherType: new (queueName: string) => BasePublisher<T>, queueNameProvider: (configuration: IConfiguration) => string
): Provider {
  return {
    get: () => {
      const configurationService: ConfigurationService = Container.get(ConfigurationService);
      const queueName = queueNameProvider(configurationService.configuration);
      return new publisherType(queueName);
    }
  };
}
