import { Inject, Singleton } from "typescript-ioc";
import { IGame } from "../games/models/iGame";
import * as fs from "fs";
import { IRating } from "../../pages/rating/models/iRating";
import { GameRatingPublisher } from "../statistics/publishers/gameRatingPublisher";

@Singleton
export class RatingsService {

  @Inject private readonly gameRatingPublisher: GameRatingPublisher;

  public rateGame(game: IGame, rating: number): void {
    const ratings = this.getAllRatings();
    const gameRating = this.getGameRatings(ratings, game.name);
    if (gameRating) {
      gameRating.nbOfRatings++;
      gameRating.totalRatings += rating;
      gameRating.average = gameRating.totalRatings / gameRating.nbOfRatings;
    } else {
      ratings.push({
        game: game.name,
        average: rating,
        totalRatings: rating,
        nbOfRatings: 1
      });
    }
    fs.writeFileSync('./games/ratings.json', JSON.stringify(ratings, null, 2));
    this.gameRatingPublisher.publish({game: game.name, rating});
  }

  public getAllRatings(): IRating[] {
    const content = fs.readFileSync("./games/ratings.json", "utf8");
    return JSON.parse(content);
  }

  public getGameRatings(ratings: IRating[], name: string): IRating {
    return ratings.find(r => r.game === name);
  }

}
