import * as React from "react";
import Rating from "react-rating";
import * as fs from "fs";
import * as path from "path";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Inject } from "typescript-ioc";
import Image from "../games/components/image"
import { IGame } from "../../services/games/models/iGame";
import styled from "@emotion/styled";
import { RatingsService } from "../../services/ratings/ratingsService";
import { InputRedirecter } from "../../services/inputsRedirecter/inputRedirecter";
import { RedirectIfInactive } from "../standby/redirectIfInactiveDecorator";
import { ConfigurationService } from "../../services/configuration/configuration";

const Wrapper = styled.div({
  backgroundColor: "rgba(255, 255, 255, 1)",
  position: "fixed",
  bottom: 0,
  top: "40vh",
  width: "70%",
  maxWidth: 900,
  marginBottom: 70,
  height: "calc(40% - 70px)",
  fontFamily: "sans-serif",
  borderRadius: 5,
  backgroundSize: "cover",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

interface IProps extends RouteComponentProps<{}> { }

interface IState {
  currentRate: number;
  game: IGame;
}

@RedirectIfInactive
export class RateGame extends React.Component<IProps, IState> {
  @Inject private readonly ratingService: RatingsService;
  @Inject private configurationService: ConfigurationService;

  private inputRedirecter = new InputRedirecter([
    {
      keys: [
        this.configurationService.configuration.standardKeys.START,
        this.configurationService.configuration.standardKeys.CENTER,
        this.configurationService.configuration.standardKeys.LEFT,
        this.configurationService.configuration.standardKeys.TOP_LEFT,
        this.configurationService.configuration.standardKeys.TOP_RIGHT,
        this.configurationService.configuration.standardKeys.BOTTOM_LEFT,
        this.configurationService.configuration.standardKeys.RIGHT
      ],
      callback: () => this.rate()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_LEFT],
      allowForcePress: true,
      callback: () => this.goLeft()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_RIGHT],
      allowForcePress: true,
      callback: () => this.goRight()
    }
  ]);

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentRate: 3,
      game: this.props.location.state.game
    };
  }

  public componentDidMount(): void {
    this.inputRedirecter.start();
  }

  public componentWillUnmount(): void {
    this.inputRedirecter.clear();
  }

  public render() {
    let imagePath: string = "";
    let imageExtension: string;
    let image: string = undefined;
    if (this.state.game.presentation.pictures) {
      imagePath = path.join(
        this.state.game.gameFolderPath,
        this.state.game.presentation.pictures[0].path
      );
      imagePath = imagePath.replace(/\\/g, "/");
      imageExtension = this.state.game.presentation.pictures[0].extension;
    }

    return (
      <div>
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          {imagePath ? (
            <Image imagePath={imagePath} imageExtension={imageExtension} style={{ width: "100%", height: "100%" }} />
          ) : null}
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Wrapper>
            <h1
              style={{
                marginTop: "calc(20% - 70px)",
                fontSize: "2.5em",
                color: "#444"
              }}
            >
              Avez-vous aimé jouer à {this.state.game.name} ?
            </h1>
            <div style={{ color: "#FDD835", fontSize: "1.25em" }}>
              <Rating
                initialRating={this.state.currentRate}
                emptySymbol="fa fa-star-o fa-4x"
                fullSymbol="fa fa-star fa-4x"
              />
            </div>
          </Wrapper>
        </div>
      </div>
    );
  }

  private goLeft() {
    this.setState(state => ({
      ...state,
      currentRate:
        this.state.currentRate - 1 > 0 ? this.state.currentRate - 1 : 0
    }));
  }

  private goRight() {
    this.setState(state => ({
      ...state,
      currentRate:
        this.state.currentRate + 1 < 6 ? this.state.currentRate + 1 : 5
    }));
  }

  private rate(): void {
    this.ratingService.rateGame(this.state.game, this.state.currentRate);
    this.props.history.push({
      pathname: "/"
    });
  }
}

export default withRouter(RateGame);
