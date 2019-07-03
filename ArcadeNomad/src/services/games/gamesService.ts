import * as fs from "fs";
import * as path from "path";
import { LazyGetter } from "lazy-get-decorator";
import { Inject, Singleton } from "typescript-ioc";
import { ChildProcess, spawn } from "child_process";
import { IGame } from "./models/iGame";
import { ConfigurationService } from "../configuration/configuration";
import { RatingsService } from "../ratings/ratingsService";

const isDirectory = source => fs.lstatSync(source).isDirectory();

const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

@Singleton
export class GamesService {
  @Inject private readonly configurationService: ConfigurationService;
  @Inject private readonly ratingsService: RatingsService;

  @LazyGetter()
  public get sortedGames(): Map<string, IGame[]> {
    const defaultGenre = this.configurationService.configuration.defaultGenre;
    const initialMap = new Map<string, IGame[]>([[defaultGenre, this.games]]);
    return this.games.reduce((map, game) => {
      game.genres.forEach(genre => {
        if (!map.has(genre)) {
          map.set(genre, []);
        }
        map.get(genre).push(game);
      });
      return map;
    }, initialMap);
  }

  @LazyGetter()
  public get games(): IGame[] {
    return getDirectories("games").map(directory => this.getGame(directory));
  }

  private getGame(directory: string): IGame {
    const content = fs.readFileSync(directory + "/informations.json", "utf8");
    const parsedGame = JSON.parse(content) as IGame;
    parsedGame.gameFolderPath = directory;
    parsedGame.rating = this.ratingsService.getGameRatings(
      this.ratingsService.getAllRatings(),
      parsedGame.name
    );
    return parsedGame;
  }
}
