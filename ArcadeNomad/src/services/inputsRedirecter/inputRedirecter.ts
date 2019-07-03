import { interval, Subscription, timer } from "rxjs";
import { IGamepadInput, IGamepadKey, IGamePadKeyDirection } from "../gamepad/models/iGamepadKey";
import { inputHubStream$ } from "../gamepad/streams";
import { IInputRedirect } from "./models/iInputRedirect";

function mapDeleteAndUnsubscribe<T>(map: Map<T, Subscription>, filter?: (item: T) => boolean): void {
  const entries = Array.from(map.entries());
  entries
    .filter(([key]) => filter != null ? filter(key) : true)
    .forEach(([key, subscription]) => {
      subscription.unsubscribe();
      map.delete(key);
    })
}

export class InputRedirecter {

  private subs: Subscription;
  private pushedRedirectRemovalSubs = new Map<IInputRedirect, Subscription>();
  private pushedRedirectTimerSubs = new Map<IInputRedirect, Subscription>();

  public pushedKeys = new Set<string>();

  constructor(private redirects: IInputRedirect[]) {
  }

  public start(): void {
    this.pushedKeys.clear();
    this.pushedRedirectRemovalSubs.clear();
    this.pushedRedirectTimerSubs.clear();
    this.subs = inputHubStream$.subscribe(input => {
      if (input.direction === IGamePadKeyDirection.DOWN) {
        this.onKeyDown(input.key);
      } else {
        this.onKeyUp(input.key);
      }
    });
  }

  public clear(): void {
    this.subs.unsubscribe();
  }

  private onKeyDown(key: string): void {
    if (this.pushedKeys.has(key)) {
      return;
    }
    this.pushedKeys.add(key);
    this.redirects
      .filter(redirect => redirect.keys.indexOf(key) !== -1)
      .forEach(redirect => this.pressRedirect(redirect));
  }

  private onKeyUp(key: string): void {
    if (this.pushedKeys.has(key)) {
      this.pushedKeys.delete(key);
    }
    mapDeleteAndUnsubscribe(this.pushedRedirectRemovalSubs, redirect => redirect.keys.indexOf(key) !== -1);
    mapDeleteAndUnsubscribe(this.pushedRedirectTimerSubs, redirect => redirect.keys.indexOf(key) !== -1);
  }

  private createKeyRemovalSubscription(redirect: IInputRedirect): void {
    if (this.pushedRedirectRemovalSubs.has(redirect)) {
      const previousSubscription = this.pushedRedirectRemovalSubs.get(redirect);
      previousSubscription.unsubscribe();
    }
    const subscription = timer(300).subscribe(() => {
      if (redirect.keys.some(key => this.pushedKeys.has(key))) {
        this.pressRedirect(redirect);
      }
    });
    this.pushedRedirectRemovalSubs.set(redirect, subscription);
  }

  private pressRedirect(redirect: IInputRedirect): void {
    const timing = redirect.timer != null ? redirect.timer() : 0;
    const timerSubscription = timer(timing).subscribe(() => {
      if (redirect.allowForcePress) {
        this.createKeyRemovalSubscription(redirect);
      }
      redirect.callback();
    });
    if (this.pushedRedirectTimerSubs.has(redirect)) {
      const previousTimerSubscription = this.pushedRedirectTimerSubs.get(redirect);
      previousTimerSubscription.unsubscribe();
    }
    this.pushedRedirectTimerSubs.set(redirect, timerSubscription);
  }

}
