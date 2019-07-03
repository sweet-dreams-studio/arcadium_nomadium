import * as gamepad from "gamepad";
import { IGamePadKeyDirection } from "./models/iGamepadKey";
import { Singleton, Inject } from "typescript-ioc";
import { ControllerHandler } from "./controllerHandler";
import { ConfigurationService } from "../configuration/configuration";

@Singleton
export class GamepadHandler extends ControllerHandler {
  private processEvents;
  private detectDevices;

  @Inject private confService: ConfigurationService;

  constructor() {
    super();
  }

  public start(): void {
    gamepad.init();
    this.processEvents = setInterval(gamepad.processEvents, 16);
    this.detectDevices = setInterval(gamepad.detectDevices, 500);
    gamepad.on("move", (id, axis, value) => {
      // console.log("move", {
      //   id, axis, value
      // })
      if (axis === this.confService.configuration.joystickAxis.VERTICAL) {
        if (value === 1) {
          this.addInputToStream(id, this.confService.configuration.standardKeys.ARROW_DOWN, IGamePadKeyDirection.DOWN);
        } else if (value === -1) {
          this.addInputToStream(id, this.confService.configuration.standardKeys.ARROW_UP, IGamePadKeyDirection.DOWN);
        } else {
          this.resetJoystick(
            id,
            this.confService.configuration.standardKeys.ARROW_UP,
            this.confService.configuration.standardKeys.ARROW_DOWN
          );
        }
      } else if (axis === this.confService.configuration.joystickAxis.HORIZONTAL) {
        if (value === 1) {
          this.addInputToStream(id, this.confService.configuration.standardKeys.ARROW_RIGHT, IGamePadKeyDirection.DOWN);
        } else if (value === -1) {
          this.addInputToStream(id, this.confService.configuration.standardKeys.ARROW_LEFT, IGamePadKeyDirection.DOWN);
        } else {
          this.resetJoystick(
            id,
            this.confService.configuration.standardKeys.ARROW_LEFT,
            this.confService.configuration.standardKeys.ARROW_RIGHT
          );
        }
      }
    });
    gamepad.on("up", (id, num) => {
      this.addInputToStream(id, this.confService.configuration.gamepadKeys[num], IGamePadKeyDirection.UP)
    }
    );
    gamepad.on("down", (id, num) => {
      // console.log("down", num);
      this.addInputToStream(id, this.confService.configuration.gamepadKeys[num], IGamePadKeyDirection.DOWN)
    }
    );
  }

  private resetJoystick(id: number, ...keys): void {
    keys.forEach(key => this.addInputToStream(id, key, IGamePadKeyDirection.UP))
  }

  public clear(): void {
    clearInterval(this.processEvents);
    clearInterval(this.detectDevices);
    gamepad.shutdown();
  }
}
