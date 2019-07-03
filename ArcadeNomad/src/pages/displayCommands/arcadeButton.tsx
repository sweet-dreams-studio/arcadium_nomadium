import * as React from "react";
import { Inject } from "typescript-ioc";
import { ArcadeButtonDrawer } from "./arcadeButtonDrawer";
import { ConfigColor } from "../../services/configuration/models/configColor";

interface IProps {
  color: ConfigColor;
  buttonRadius: number;
  style: React.CSSProperties;
  pushed?: boolean;
}

export default class ArcadeButton extends React.Component<IProps, {}> {
  @Inject private readonly arcadeButtonDrawer: ArcadeButtonDrawer;
  private canvasRef = React.createRef<HTMLCanvasElement>();

  public componentDidMount(): void {
    this.draw();
  }

  public render() {
    const { style } = this.props;
    const canvasSize = `${this.props.buttonRadius * 2}px`;
    return (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          ...style
        }}
      >
        <div style={{ flex: "0" }}>
          <canvas
            style={{ width: canvasSize, height: canvasSize }}
            ref={this.canvasRef}
          />
        </div>
        <div style={{ flex: "1" }}>{this.props.children}</div>
      </div>
    );
  }

  private draw(): void {
    const canvas = this.canvasRef.current;
    const size = canvas.getBoundingClientRect().width;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.ceil(size / 2);
    this.arcadeButtonDrawer.draw(
      canvas,
      radius,
      radius,
      radius,
      this.props.color,
      this.props.pushed !== undefined ? this.props.pushed : false
    );
  }
}
