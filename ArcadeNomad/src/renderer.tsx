import "./index.html";
import "./main.js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, HashRouter } from "react-router-dom";
import "./services/monitoring/cpuMonitor";
import Standby from "./pages/standby/standby";
import Games from "./pages/games/games";
import DisplayCommands from "./pages/displayCommands/displayCommands";
import { RateGame } from "./pages/rating/rateGame";
import { Inject } from "typescript-ioc";
import { ApplicationLifecycle } from "./services/applicationLifecycle";

class App extends React.Component<{}, {}> {
  @Inject private applicationLifecycle: ApplicationLifecycle;

  public componentDidMount(): void {
    this.applicationLifecycle.start();
  }

  public componentWillUnmount(): void {
    this.applicationLifecycle.stop();
  }

  public render() {
    return (
      <HashRouter>
        <Route exact={true} path="/" component={Games}/>
        <Route path="/standby" component={Standby}/>
        <Route path="/rategame" component={RateGame}/>
        <Route path="/displaycommands" component={DisplayCommands}/>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));
