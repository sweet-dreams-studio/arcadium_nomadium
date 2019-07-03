import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { first } from "rxjs/operators";
import { inputHubStream$ } from "../../services/gamepad/streams";
import { GamesService } from "../../services/games/gamesService";
import { Inject } from "typescript-ioc";
import { IGame } from "../../services/games/models/iGame";
import { CommandsDisplayDrawer } from "./commandsDisplayDrawer";
import { InputRedirecter } from "../../services/inputsRedirecter/inputRedirecter";
import { GameLifecycleService } from "../../services/games/gameLifecycleService";
import log from "electron-log";
import { RedirectIfInactive } from "../standby/redirectIfInactiveDecorator";
import { ConfigurationService } from "../../services/configuration/configuration";
import { Subscription } from "rxjs";
import { backgroundImages } from "polished";

interface IProps extends RouteComponentProps<{}> { }

@RedirectIfInactive
class DisplayCommands extends React.Component<IProps, {}> {
  @Inject private readonly gamesService: GamesService;
  @Inject private readonly gameLifecycleService: GameLifecycleService;
  @Inject private configurationService: ConfigurationService;

  private inputRedirecter = new InputRedirecter([
    {
      keys: [this.configurationService.configuration.standardKeys.START],
      callback: () => this.start()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.SELECT],
      timer: () =>
        this.gameLifecycleService.isActive()
          ? this.configurationService.configuration.controllers.longpressSelect
          : 0,
      callback: () => this.select()
    }
  ]);

  private canvas = React.createRef<HTMLCanvasElement>();
  private buttonsDrawer: CommandsDisplayDrawer;
  private subs: Subscription;

  constructor(props: IProps) {
    super(props);
    this.start = this.start.bind(this);
    this.select = this.select.bind(this);
    this.buttonsDrawer = new CommandsDisplayDrawer(this.canvas, this.game);
  }

  public redraw(): void {
    this.buttonsDrawer.draw(this.inputRedirecter.pushedKeys);
  }

  public componentDidMount(): void {
    window.addEventListener("resize", this.redraw.bind(this));
    this.inputRedirecter.start();
    this.redraw();
    this.catchInputChanges();
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.redraw.bind(this));
    this.inputRedirecter.clear();
    this.subs.unsubscribe();
  }

  public render() {
    return (
      <div
        style={{
          background: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "sans-serif",
          height: "100vh"
        }}
      >
        <h1
          style={{
            fontSize: "1.75em",
            fontWeight: "bold",
            margin: "5vh"
          }}
        >
          Liste des commandes pour <b>{this.game.name}</b> !
        </h1>
        <canvas
          ref={this.canvas}
          style={{
            display: "block",
            padding: 20,
            boxSizing: "border-box",
            background: "linear-gradient(to right, #d4d4d4, #c2c2c2)",
            borderRadius: 8,
            boxShadow:
              "0 13px 27px -5px rgba(50,50,93,.25),0 8px 16px -8px rgba(0,0,0,.3),0 -6px 16px -6px rgba(0,0,0,.025)"
          }}
        />
      </div>
    );
  }

  private start(): void {
    const gameStop$ = this.gameLifecycleService.launch(this.game);
    gameStop$.pipe(first()).subscribe(error => {
      log.info("child process exited");
      if (error) {
        this.props.history.push("/");
      } else {
        this.goToRating();
      }
    });
  }

  private select(): void {
    if (this.gameLifecycleService.isActive()) {
      this.gameLifecycleService.kill();
    } else {
      this.props.history.push({
        pathname: "/"
      });
    }
  }

  private goToRating(): void {
    this.props.history.push({
      pathname: "/rategame",
      state: { game: this.game }
    });
  }

  private catchInputChanges(): void {
    this.subs = inputHubStream$.subscribe(() => this.redraw());
  }

  private get game(): IGame {
    return this.props.location.state.game;
  }
}

export default withRouter(DisplayCommands);
