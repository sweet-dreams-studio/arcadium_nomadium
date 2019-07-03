import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Subscription } from "rxjs";
import { getIsActiveStream } from "../../services/gamepad/streams";
import { filter } from "rxjs/operators";

export function RedirectIfInactive<Props extends RouteComponentProps<any>, T extends React.ComponentClass<Props, any>>(Component: T): T {
  return class extends React.Component<Props> {
    private subscription: Subscription;

    public componentDidMount(): void {
      this.subscription = getIsActiveStream()
        .pipe(filter(isActive => !isActive))
        .subscribe(() => {
          this.props.history.push({
            pathname: "/standby"
          });
        });
    }

    public componentWillUnmount(): void {
      this.subscription.unsubscribe();
    }

    public render() {
      const ComponentToSpawn = Component as React.ComponentClass;
      return <ComponentToSpawn {...this.props}/>;
    }
  } as any as T;
}
