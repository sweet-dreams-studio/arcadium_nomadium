import { IGamePadKeyDirection } from "./models/iGamepadKey";
import { Singleton, Inject } from "typescript-ioc";
import { Subscription, fromEvent } from "rxjs";
import { filter, distinctUntilChanged, merge, tap } from "rxjs/operators";
import { KeyboardKey } from "./models/keyboardKey";
import { ControllerHandler } from "./controllerHandler";
import { ConfigurationService } from "../configuration/configuration";

@Singleton
export class KeyboardHandler extends ControllerHandler {
  private subs: Subscription;

  @Inject private configurationService: ConfigurationService;

  constructor() {
    super();
    this.subs = new Subscription();
  }

  public start(): void {
    const keyDowns = fromEvent(document, "keydown");
    const keyUps = fromEvent(document, "keyup");
    this.subs.add(
      keyDowns
        .pipe(
          merge(keyUps),
          filter((e: KeyboardEvent) => {
            return (
              Object.values(KeyboardKey).filter(v => v === e.keyCode).length > 0
            );
          }),
          distinctUntilChanged((x, y) => x.type === y.type),
          tap((e: KeyboardEvent) => {
            const direction =
              e.type === "keydown"
                ? IGamePadKeyDirection.DOWN
                : IGamePadKeyDirection.UP;
            this.addInputToStream(
              0,
              this.configurationService.configuration.keyboardKeys[e.keyCode],
              direction
            );
          })
        )
        .subscribe()
    );
  }

  public clear(): void {
    this.subs.unsubscribe();
  }
}
