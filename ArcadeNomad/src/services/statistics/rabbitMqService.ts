import * as amqplib from "amqplib";
import { Container, Provided, Provider, Singleton } from "typescript-ioc";
import { ConfigurationService } from "../configuration/configuration";

export interface IRabbitMQConnectionOptions {
  ip: string;
  port?: number;
  login: string;
  password: string;
}

export interface IRabbitMQPublishResponse {
  ok: boolean;
  error?: string;
}

const RabbitMqServiceProvider: Provider = {
  get: () => {
    const configurationService: ConfigurationService = Container.get(
      ConfigurationService
    );
    const configuration = configurationService.configuration.service.rabbitMq;
    return new RabbitMqService({
      ip: configuration.ip,
      login: configuration.login,
      port: configuration.port,
      password: configuration.password
    });
  }
};

@Singleton
@Provided(RabbitMqServiceProvider)
export class RabbitMqService {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  constructor(private connectionOptions: IRabbitMQConnectionOptions) {}

  public get connected(): boolean {
    return this.connection !== undefined;
  }

  public async connect(): Promise<{ connected: boolean; error?: string }> {
    try {
      this.connection = await amqplib.connect(this.connectionString);
      this.channel = await this.connection.createChannel();
      return { connected: true };
    } catch (error) {
      this.connection = undefined;
      this.channel = undefined;
      return { connected: false, error: String(error) };
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }
    await this.connection.close();
  }

  public publish<T extends object>(
    queueName: string,
    message: T
  ): IRabbitMQPublishResponse {
    const json = JSON.stringify(message);
    const buffer = Buffer.from(json);
    try {
      const ok = this.channel.sendToQueue(queueName, buffer);
      return { ok };
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }

  private get connectionString(): string {
    const defaultPort = 5672;
    const { ip, login, password } = this.connectionOptions;
    const port = this.connectionOptions.port || defaultPort;
    return `amqp://${login}:${password}@${ip}:${port}`;
  }
}
