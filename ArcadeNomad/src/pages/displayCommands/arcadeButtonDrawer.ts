import { Singleton } from "typescript-ioc";
import { darken, lighten, transparentize } from "polished";
import { ConfigColor, configColorValues } from "../../services/configuration/models/configColor";
import { fillCircle } from "./helpers/fillCircle";

@Singleton
export class ArcadeButtonDrawer {

  public draw(canvas: HTMLCanvasElement, x: number, y: number, radius: number, color: ConfigColor, pushed: boolean) {
    const colorStr = configColorValues[color];
    const ctx = canvas.getContext("2d");
    if (pushed) {
      this.fillCirclesPushed(ctx, x, y, radius, colorStr);
    } else {
      this.fillCirclesNonPushed(ctx, x, y, radius, colorStr);
    }
  }

  private fillCirclesNonPushed(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorStr: string): void {
    fillCircle(ctx, x, y, radius, colorStr);
    fillCircle(ctx, x, y, radius * 0.9, darken(0.03, colorStr));
    fillCircle(ctx, x, y, radius * 0.85, darken(0.4, colorStr));
    fillCircle(ctx, x, y, radius * 0.8, lighten(0.03, colorStr));
    fillCircle(ctx, x, y, radius * 0.8, transparentize(0.8, lighten(0.3, colorStr)));
    fillCircle(ctx, x, y, radius * 0.73, darken(0.02, colorStr));
  }

  private fillCirclesPushed(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorStr: string): void {
    fillCircle(ctx, x, y, radius, colorStr);
    fillCircle(ctx, x, y, radius * 0.9, darken(0.03, colorStr));
    fillCircle(ctx, x, y, radius * 0.85, darken(0.4, colorStr));
    fillCircle(ctx, x, y, radius * 0.8, lighten(0.03, colorStr));
    fillCircle(ctx, x, y, radius * 0.8, transparentize(0.8, darken(0.3, colorStr)));
    fillCircle(ctx, x, y, radius * 0.73, darken(0.02, colorStr));
  }

}
