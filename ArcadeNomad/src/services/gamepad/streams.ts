import { Subject, BehaviorSubject, Observable } from "rxjs";
import { IGamepadInput, IGamepadKey } from "./models/iGamepadKey";
import {
  withLatestFrom,
  filter,
  map,
  distinctUntilChanged,
} from "rxjs/operators";
import { IGame } from "../games/models/iGame";

export const inputStream$ = new Subject<IGamepadInput>();
export const launchedGameIdStream$ = new BehaviorSubject<IGame>(null);
export const isActiveStream$ = new BehaviorSubject<boolean>(true);

// Stream for the UI
export const inputHubStream$: Observable<IGamepadInput> = inputStream$.pipe(
  withLatestFrom(launchedGameIdStream$),
  filter(([input, launchedGameId]) => launchedGameId === null || input.key === "SELECT"),
  map(([input]) => input)
);

export function getIsActiveStream(): Observable<boolean> {
  return isActiveStream$.asObservable().pipe(distinctUntilChanged());
}

export function updateLaunchedGame(game: IGame): void {
  launchedGameIdStream$.next(game);
}
