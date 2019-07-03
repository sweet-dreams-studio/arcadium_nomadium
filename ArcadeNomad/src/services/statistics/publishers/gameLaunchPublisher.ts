import { BasePublisher, createPublisherProvider } from "../basePublisher";
import { Provided, Singleton } from "typescript-ioc";

export interface IGameLaunchMessage {
  game: string;
}

@Singleton
@Provided(createPublisherProvider(GameLaunchPublisher, c => c.service.rabbitMq.queueNames.gameLaunched))
export class GameLaunchPublisher extends BasePublisher<IGameLaunchMessage> {
}
