import * as fs from "fs";
import { LazyGetter } from "lazy-get-decorator";
import { Singleton } from "typescript-ioc";
import { IGamepadKey } from "../gamepad/models/iGamepadKey";
import { IArcadeButton } from "./models/iArcadeButton";
import { ConfigColor } from "./models/configColor";
import { IDynamicImage } from "../imagesDisplay/iDynamicImage";

export interface IConfiguration {
  arcadeId: number;
  service: {
    enabled: boolean;
    rabbitMq: {
      ip: string;
      login: string;
      password: string;
      port?: number;
      queueNames: {
        gameLaunched: string;
        gameRating: string;
      };
    };
  };
  pauseImages: IDynamicImage[];
  monitoring: {
    enabled: boolean;
    secondsInterval: number;
  };
  controllers: {
    timeUntilInactivity: number;
    longpressSelect: number;
    gamepad: {
      enabled: boolean;
    },
    keyboard: {
      enabled: boolean;
    }
  };
  defaultGenre: string;
  standardKeys: {
    ARROW_UP: string,
    ARROW_DOWN: string,
    ARROW_LEFT: string,
    ARROW_RIGHT: string,
    BOTTOM_LEFT: string,
    RIGHT: string,
    LEFT: string,
    TOP_RIGHT: string,
    TOP_LEFT: string,
    CENTER: string,
    SELECT: string,
    START: string
  };
  keyboardKeys: any;
  joystickAxis: {
    HORIZONTAL: number,
    VERTICAL: number
  }
  gamepadKeys: any;
  keys: {
    textSizePercentage: number;
    joystickPlacement: {
      color: ConfigColor;
      radiusPercentage: number;
      xPercentage: number;
      yPercentage: number;
      textDistancePercentage: number;
    }
    buttonPlacements: { [id in IGamepadKey]: IArcadeButton }
  }
}

@Singleton
export class ConfigurationService {
  @LazyGetter()
  public get configuration(): IConfiguration {
    const configurationFilePath = "config.json";
    const rawConfigurationData = fs.readFileSync(configurationFilePath);
    return JSON.parse(rawConfigurationData.toString()) as IConfiguration;
  }
}
