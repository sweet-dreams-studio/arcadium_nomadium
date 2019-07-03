import * as si from "systeminformation";
import { Logger } from "./logger";
import { interval, Observable, Subscription } from "rxjs";
import { Inject, Provided, Singleton } from "typescript-ioc";
import { CpuMonitorProvider } from "./cpuMonitorProvider";

@Singleton
@Provided(CpuMonitorProvider)
export class CpuMonitor {
  @Inject private logger: Logger;

  private trigger: Observable<any>;
  private subscription: Subscription;

  constructor(millisecondsInterval: number) {
    this.trigger = interval(millisecondsInterval);
  }

  public start(): void {
    this.subscription = this.trigger.subscribe(() => this.log());
  }

  public stop(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  private async log(): Promise<void> {
    const [load, temperature] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature()
    ]);
    this.logger.log({
      temperature: parseInt(temperature.main, 10),
      cpuLoad: load.currentload
    });
  }
}
