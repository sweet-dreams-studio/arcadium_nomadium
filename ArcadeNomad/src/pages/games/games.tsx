import * as React from "react";
import { IGame } from "../../services/games/models/iGame";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Inject } from "typescript-ioc";
import { GamesService } from "../../services/games/gamesService";
import { RatingsService } from "../../services/ratings/ratingsService";
import Carousel from "react-spring-3d-carousel";
import InfoComponent from "./components/info";
import GenresComponent from "./components/genres";
import { generateSlides, ISlide } from "./slidesGen";
import { InputRedirecter } from "../../services/inputsRedirecter/inputRedirecter";
import { RedirectIfInactive } from "../standby/redirectIfInactiveDecorator";
import { IRating } from "../../pages/rating/models/iRating";
import { ConfigurationService } from "../../services/configuration/configuration";

interface IProps extends RouteComponentProps<{}> {
  setLaunchedGame?(): void;
  resetLaunchedGame?(): void;
}

interface IState {
  selectedGameId: number;
  selectedGenre: number;
}

@RedirectIfInactive
class Games extends React.Component<IProps, IState> {
  private readonly games: Map<string, IGame[]>;
  private readonly genres: string[];
  private readonly ratings: IRating[];

  @Inject private readonly gamesService: GamesService;
  @Inject private readonly ratingsService: RatingsService;
  @Inject private configurationService: ConfigurationService;

  private readonly slides: Map<string, ISlide[]>;

  private inputRedirecter = new InputRedirecter([
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_LEFT],
      allowForcePress: true,
      callback: () => this.goLeft()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_RIGHT],
      allowForcePress: true,
      callback: () => this.goRight()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_DOWN],
      callback: () => this.genreDown()
    },
    {
      keys: [this.configurationService.configuration.standardKeys.ARROW_UP],
      callback: () => this.genreUp()
    },
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
      callback: () => this.startGame()
    }
  ]);

  constructor(props: IProps) {
    super(props);
    this.games = this.gamesService.sortedGames;
    this.slides = generateSlides(this.games);
    this.genres = Array.from(this.games.keys());
    this.ratings = this.ratingsService.getAllRatings();

    this.state = {
      selectedGameId: 0,
      selectedGenre: 0
    };
  }

  public render() {
    const currentGame: IGame = this.getCurrentGame();

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "50%",
            height: "30%",
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            top: 20
          }}
        >
          <GenresComponent
            genres={this.genres}
            selectedGenre={this.state.selectedGenre}
          />
          <Carousel
            slides={this.slides.get(this.genres[this.state.selectedGenre])}
            goToSlide={this.state.selectedGameId}
            animationConfig={{ tension: 120, friction: 14 }}
            offsetRadius={3}
            showNavigation={false}
          />
        </div>

        <InfoComponent
          game={currentGame}
          rating={this.ratingsService.getGameRatings(
            this.ratings,
            currentGame.name
          )}
        />
      </div>
    );
  }

  public getCurrentGame(): IGame {
    return this.games.get(this.genres[this.state.selectedGenre])[
      this.state.selectedGameId
    ];
  }

  public componentDidMount(): void {
    this.inputRedirecter.start();
  }

  public componentWillUnmount(): void {
    this.inputRedirecter.clear();
  }

  private goLeft(): void {
    this.setState(state => ({
      selectedGameId: this.boundedSelectedGameId(state.selectedGameId - 1)
    }));
  }

  private genreUp(): void {
    this.setState(state => ({
      selectedGenre: this.boundedSelectedGenre(state.selectedGenre - 1),
      selectedGameId: 0
    }));
  }

  private genreDown(): void {
    this.setState(state => ({
      selectedGenre: this.boundedSelectedGenre(state.selectedGenre + 1),
      selectedGameId: 0
    }));
  }

  private goRight(): void {
    this.setState(state => ({
      selectedGameId: this.boundedSelectedGameId(state.selectedGameId + 1)
    }));
  }

  private startGame(): void {
    this.props.history.push({
      pathname: "/displaycommands",
      state: { game: this.getCurrentGame() }
    });
  }

  private boundedSelectedGameId(selectedGameId: number): number {
    const min = 0;
    const max =
      this.slides.get(this.genres[this.state.selectedGenre]).length - 1;
    if (selectedGameId < min) {
      return max;
    } else if (selectedGameId > max) {
      return min;
    }
    return selectedGameId;
  }

  private boundedSelectedGenre(selectedGenre: number): number {
    const min = 0;
    const max = this.genres.length - 1;
    if (selectedGenre < min) {
      return max;
    } else if (selectedGenre > max) {
      return min;
    }
    return selectedGenre;
  }
}

export default withRouter(Games);
