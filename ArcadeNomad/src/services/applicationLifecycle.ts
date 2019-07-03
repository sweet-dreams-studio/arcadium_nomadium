import { Inject, Singleton } from "typescript-ioc";
import { CpuMonitor } from "./monitoring/cpuMonitor";
import { ConfigurationService, IConfiguration } from "./configuration/configuration";
import { GamepadHandler } from "./gamepad/gamepadHandler";
import { StatisticsService } from "./statistics/statisticsService";
import { StreamHandler } from "./gamepad/streamHandler";
import { KeyboardHandler } from "./gamepad/keyboardHandler";
import log from "electron-log";
import { GameRatingPublisher } from "./statistics/publishers/gameRatingPublisher";

@Singleton
export class ApplicationLifecycle {
  @Inject private readonly cpuMonitor: CpuMonitor;
  @Inject private readonly gamepadHandler: GamepadHandler;
  @Inject private readonly streamHandler: StreamHandler;
  @Inject private readonly keyboardHandler: KeyboardHandler;
  @Inject private readonly configurationService: ConfigurationService;
  @Inject private readonly statisticsService: StatisticsService;

  @Inject private readonly gameRatingPublisher: GameRatingPublisher;

  public start(): void {
    if (this.configuration.monitoring.enabled) {
      this.cpuMonitor.start();
    }
    this.connectStatisticsService();
    if (this.configuration.controllers.gamepad.enabled) {
      this.gamepadHandler.start();
    }
    if (this.configuration.controllers.keyboard.enabled) {
      this.keyboardHandler.start();
    }
    this.streamHandler.start();
  }

  public stop(): void {
    this.cpuMonitor.stop();
    this.statisticsService.disconnect();
    this.gamepadHandler.clear();
    this.keyboardHandler.clear();
  }

  private async connectStatisticsService(): Promise<void> {
    if (this.configuration.service.enabled) {
      const connected = await this.statisticsService.connect();
      const message = connected
        ? "Successfully connected to the statistics service"
        : "Error connecting to the statistics service";
      log.info(message);
    }
  }

  private get configuration(): IConfiguration {
    return this.configurationService.configuration;
  }
}
