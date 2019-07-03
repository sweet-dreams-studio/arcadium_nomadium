import * as React from "react";
import { Inject } from "typescript-ioc";
import { IGame } from "../../services/games/models/iGame";
import { ConfigurationService } from "../../services/configuration/configuration";
import { ArcadeButtonDrawer } from "./arcadeButtonDrawer";
import { IArcadeButton, XTextAlign, YTextAlign } from "../../services/configuration/models/iArcadeButton";
import { fillCircle } from "./helpers/fillCircle";
import { configColorValues } from "../../services/configuration/models/configColor";

interface ITextToDraw {
  key: IArcadeButton,
  text: string,
  buttonX: number;
  buttonY: number;
  buttonRadius: number;
  pushed: boolean;
}

export class CommandsDisplayDrawer {

  @Inject private readonly configurationService: ConfigurationService;
  @Inject private readonly arcadeButtonDrawer: ArcadeButtonDrawer;

  private textsToDraw: ITextToDraw[];
  private pushedKeys: Set<string>;

  constructor(private canvasRef: React.RefObject<HTMLCanvasElement>, private game: IGame) {
  }

  public draw(pushedKeys: Set<string>): void {
    this.pushedKeys = pushedKeys;
    this.clear();
    this.resize();
    this.drawArcadeButtons();
    this.drawTexts();
    this.drawJoystick();
  }

  private resize(): void {
    this.setSize();
  }

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.textsToDraw = [];
  }

  private drawArcadeButtons(): void {
    const keyPlacements = Object.entries(this.configurationService.configuration.keys.buttonPlacements);
    keyPlacements
      .map(([keyId, key]) => ({
        keyId,
        key,
        pushed: this.pushedKeys.has(keyId)
      }))
      .forEach(({ keyId, key, pushed }) => this.drawArcadeButton(keyId, key, pushed));
  }

  private drawArcadeButton(keyId: string, key: IArcadeButton, pushed: boolean): void {
    const computedRadius = Math.ceil((this.canvas.height + this.canvas.width) / 2 * key.radiusPercentage / 100);
    const { x: computedX, y: computedY } = this.calculateCirclePos(key.xPercentage, key.yPercentage, computedRadius);
    const keyText = this.getKeyText(keyId);
    if (keyText != null) {
      this.textsToDraw.push({
        key,
        text: keyText,
        buttonX: computedX,
        buttonY: computedY,
        buttonRadius: computedRadius,
        pushed
      });
    }
    this.arcadeButtonDrawer.draw(this.canvas, computedX, computedY, computedRadius, key.color, pushed);
  }

  private initializeTextDraw(bold: boolean): void {
    this.ctx.fillStyle = "black";
    this.ctx.font = `${bold ? 'bold ' : ''}${this.textSize}pt Arial`;
  }

  private drawTexts(): void {
    for (const textToDraw of this.textsToDraw) {
      this.initializeTextDraw(textToDraw.pushed);
      const { angleDeg, distancePercentage } = textToDraw.key.displayText;
      this.drawRelativeText(textToDraw.text, textToDraw.buttonX, textToDraw.buttonY, angleDeg, distancePercentage,
        textToDraw.key.displayText.xAlign, textToDraw.key.displayText.yAlign);
    }
  }

  private drawJoystick(): void {
    const joyStickConfig = this.configurationService.configuration.keys.joystickPlacement;
    const radius = Math.ceil(this.size * joyStickConfig.radiusPercentage / 100);
    const { x, y } = this.calculateCirclePos(joyStickConfig.xPercentage, joyStickConfig.yPercentage, radius);
    fillCircle(this.ctx, x, y, radius, configColorValues[joyStickConfig.color]);
    const distancePercentage = joyStickConfig.textDistancePercentage;
    this.drawJoystickText(this.configurationService.configuration.standardKeys.ARROW_UP, x, y, 270, distancePercentage, XTextAlign.Center, YTextAlign.Top);
    this.drawJoystickText(this.configurationService.configuration.standardKeys.ARROW_DOWN, x, y, 90, distancePercentage, XTextAlign.Center, YTextAlign.Bottom);
    this.drawJoystickText(this.configurationService.configuration.standardKeys.ARROW_RIGHT, x, y, 0, distancePercentage, XTextAlign.Left, YTextAlign.Center);
    this.drawJoystickText(this.configurationService.configuration.standardKeys.ARROW_LEFT, x, y, 180, distancePercentage, XTextAlign.Right, YTextAlign.Center);
  }

  private drawJoystickText(key: string, x: number, y: number, angleDeg: number,
    distancePercentage: number, xAlign: XTextAlign, yAlign: YTextAlign): void {
    const text = this.getKeyText(key);
    if (text != null) {
      const pushed = this.pushedKeys.has(key);
      this.initializeTextDraw(pushed);
      this.drawRelativeText(text, x, y, angleDeg, distancePercentage, xAlign, yAlign);
    }
  }

  private drawRelativeText(text: string, xOrigin: number, yOrigin: number, angleDeg: number,
    distancePercentage: number, xAlign: XTextAlign, yAlign: YTextAlign): void {
    const toRadians = (deg: number): number => deg * Math.PI / 180;
    const angleRad = toRadians(angleDeg);
    const distancePixels = this.canvas.width * distancePercentage / 100;
    const textWidth = this.ctx.measureText(text).width;
    let x = xOrigin + Math.cos(angleRad) * distancePixels;
    if (xAlign === XTextAlign.Center) {
      x -= textWidth / 2;
    } else if (xAlign === XTextAlign.Right) {
      x -= textWidth;
    }
    let y = yOrigin + Math.sin(angleRad) * distancePixels;
    if (yAlign === YTextAlign.Center) {
      y += this.textSize / 2;
    } else if (yAlign === YTextAlign.Bottom) {
      y += this.textSize;
    }
    this.ctx.fillText(text, x, y);
  }

  private calculateCirclePos(xPercentage: number, yPercentage: number, radius: number): { x: number, y: number } {
    const consideredWidth = this.canvas.width - radius * 2;
    const consideredHeight = this.canvas.height - radius * 2;

    return {
      x: Math.ceil(consideredWidth * xPercentage / 100 + radius),
      y: Math.ceil(consideredHeight * yPercentage / 100 + radius)
    };
  }

  private getKeyText(keyId: string): string {
    return this.game.keyTexts && this.game.keyTexts[keyId];
  }

  private get textSize(): number {
    const textHeightPercentage = this.configurationService.configuration.keys.textSizePercentage;
    return Math.ceil(this.size * textHeightPercentage / 100);
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.current;
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext("2d");
  }

  private get size(): number {
    return this.canvas.getBoundingClientRect().height;
  }

  private setSize() {
    if (window.innerWidth > 1600) {
      this.canvas.width = 1200;
      this.canvas.height = 800;
    }
    else {
      this.canvas.width = window.innerWidth * 0.8;
      this.canvas.height = window.innerHeight * 0.8;
    }
  }

}
