import { Provided, Singleton } from "typescript-ioc";
import { BasePublisher, createPublisherProvider } from "../basePublisher";
import { GameLaunchPublisher } from "./gameLaunchPublisher";

export interface IGameRaringMessage {
  game: string;
  rating: number;
}

@Singleton
@Provided(createPublisherProvider(GameLaunchPublisher, c => c.service.rabbitMq.queueNames.gameRating))
export class GameRatingPublisher extends BasePublisher<IGameRaringMessage> {
}
