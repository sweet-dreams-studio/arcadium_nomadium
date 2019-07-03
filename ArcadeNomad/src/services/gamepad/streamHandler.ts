import { Singleton, Inject } from "typescript-ioc";
import { Subscription } from "rxjs";
import { filter, tap, withLatestFrom, map, startWith, debounceTime } from "rxjs/operators";
import { IGamepadInput, IGamePadKeyDirection } from "./models/iGamepadKey";
import { IGame } from "../games/models/iGame";
import { ConfigurationService } from "../configuration/configuration";
import {
    inputStream$,
    launchedGameIdStream$,
    isActiveStream$
} from "./streams";
import { Key, keylib } from "keylib";

@Singleton
export class StreamHandler {
    private subs: Subscription;

    @Inject private configurationService: ConfigurationService;

    constructor() {
        this.subs = new Subscription();
    }

    public start(): void {
        // Subscription for simulating inputs
        this.subs.add(
            inputStream$
                .pipe(
                    withLatestFrom(launchedGameIdStream$),
                    filter(([, launchedGame]) => launchedGame !== null),
                    map(([input, launchedGame]) => {
                        this.simulateInput(input, launchedGame);
                    })
                )
                .subscribe()
        );

        // Subscription for isActive
        this.subs.add(
            inputStream$
                .pipe(
                    startWith(null),
                    tap(() => isActiveStream$.next(true)),
                    debounceTime(
                        this.configurationService.configuration.controllers.timeUntilInactivity
                    ),
                    tap(() => isActiveStream$.next(false))
                )
                .subscribe()
        );

        // Subscription for isActive
        this.subs.add(inputStream$
            .pipe(
                startWith(null),
                tap(() => isActiveStream$.next(true)),
                debounceTime(this.configurationService.configuration.controllers.timeUntilInactivity),
                tap(() => isActiveStream$.next(false)),
            )
            .subscribe());
    }

    private simulateInput(gamepadInput: IGamepadInput, game: IGame): void {
        const keybindsKey = game.keybinds[gamepadInput.id][gamepadInput.key];
        const keyConverted = Key[Key[keybindsKey]];
        if (keyConverted) {
            if (gamepadInput.direction === IGamePadKeyDirection.UP) {
                keylib.release(keyConverted);
            } else {
                keylib.press(keyConverted);
            }
        }
    }
}
