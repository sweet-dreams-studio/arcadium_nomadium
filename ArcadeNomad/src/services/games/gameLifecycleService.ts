import { Inject, Singleton } from "typescript-ioc";
import { ChildProcess, spawn } from "child_process";
import { IGame } from "./models/iGame";
import { updateLaunchedGame } from "../gamepad/streams";
import { Observable, Subject } from "rxjs";
import { GameLaunchPublisher } from "../statistics/publishers/gameLaunchPublisher";
import { GameStatisticsLoggerService } from "../gameStatistics/gameStatisticsLoggerService";

@Singleton
export class GameLifecycleService {
  private process: ChildProcess;
  @Inject private readonly gameLaunchPublisher: GameLaunchPublisher;
  @Inject
  private readonly gameStatisticsLoggerService: GameStatisticsLoggerService;

  public launch(game: IGame): Observable<boolean> {
    this.gameLaunchPublisher.publish({ game: game.name });
    let path: string[] = game.exePath.split("\\");
    path.pop();

    this.process = spawn(game.exePath, {
      cwd: path.join("\\")
    });

    const startTime = new Date();
    updateLaunchedGame(game);

    const gameStop$ = new Subject<boolean>();
    this.process.on("exit", code => {
      updateLaunchedGame(null);
      this.gameStatisticsLoggerService.logGameUse(game, startTime, new Date());
      gameStop$.next(false);
    });
    this.process.on("error", error => {
      updateLaunchedGame(null);
      this.process = null;
      gameStop$.next(true);
    });

    return gameStop$;
  }

  public isActive(): boolean {
    return this.process != null && !this.process.killed;
  }

  public kill(): boolean {
    if (!this.isActive()) {
      return false;
    }
    this.process.kill();
    return true;
  }
}
