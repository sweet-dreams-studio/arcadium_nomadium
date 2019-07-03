import { Singleton } from "typescript-ioc";
import { IGame } from "../games/models/iGame";
import * as fs from "fs";

export interface IGameStatistic {
  game: string;
  startTime: Date;
  endTime: Date;
}

@Singleton
export class GameStatisticsLoggerService {
  public logGameUse(game: IGame, startTime: Date, endTime: Date): void {
    const statistics: IGameStatistic[] = this.getAllStatistics();

    const stat: IGameStatistic = { game: game.name, startTime, endTime };

    statistics.push(stat);

    fs.writeFile(
      "./games/statistics.json",
      JSON.stringify(statistics, null, 2),
      err => {
        if (err) {
          console.log(err);
        }
        console.log("Successfully Written to File.");
      }
    );
  }

  public getAllStatistics(): IGameStatistic[] {
    try {
      return JSON.parse(fs.readFileSync("./games/statistics.json", "utf8"));
    } catch (err) {
      return [];
    }
  }
}
