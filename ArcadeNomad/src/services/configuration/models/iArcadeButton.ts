import { ConfigColor } from "./configColor";

export enum XTextAlign {
  Center = "center",
  Right = "right",
  Left = "left"
}

export enum YTextAlign {
  Center = "center",
  Bottom = "bottom",
  Top = "top"
}

export interface IArcadeButton {
  xPercentage: number;
  yPercentage: number;
  color: ConfigColor;
  radiusPercentage: number;
  displayText: {
    enabled: boolean;
    angleDeg: number;
    distancePercentage: number;
    xAlign: XTextAlign;
    yAlign: YTextAlign;
  };
}
