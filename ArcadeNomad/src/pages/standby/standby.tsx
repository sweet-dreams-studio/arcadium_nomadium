import * as React from "react";
import * as fs from "fs";
import { Subscription } from "rxjs";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { filter } from "rxjs/operators";
import { getIsActiveStream } from "../../services/gamepad/streams";
import { IDynamicImage } from "../../services/imagesDisplay/iDynamicImage";
import { ConfigurationService } from "../../services/configuration/configuration";
import { Inject } from "typescript-ioc";
import Image from "../games/components/image";

interface IProps extends RouteComponentProps<{}> {}

interface IState {
  selectedImageId: number;
  images: IDynamicImage[];
}
class Standby extends React.Component<IProps, IState> {
  @Inject private readonly configurationService: ConfigurationService;

  private interval = null;
  private subscriptionIsActive: Subscription;

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedImageId: 0,
      images: this.configurationService.configuration.pauseImages
    };
  }

  public componentDidMount(): void {
    this.subscriptionIsActive = getIsActiveStream()
      .pipe(filter(isActive => isActive))
      .subscribe(() => {
        this.props.history.push({
          pathname: "/"
        });
      });
    this.interval = setInterval(this.change, 10000);
  }

  public componentWillUnmount(): void {
    this.subscriptionIsActive.unsubscribe();
    clearInterval(this.interval);
  }

  public render() {
    const selectedImage = this.state.images[this.state.selectedImageId];

    if (selectedImage) {
      return (
        <Image
          imagePath={selectedImage.path}
          imageExtension={selectedImage.extension}
          style={{
            backgroundSize: "100%",
            backgroundColor: "white",
            minHeight: "100%",
            minWidth: "100%"
          }}
        />
      );
    } else {
      return <div>Standby</div>;
    }
  }

  private change = () => {
    if (this.state.selectedImageId < this.state.images.length - 1) {
      this.setState(state => ({
        images: this.state.images,
        selectedImageId: state.selectedImageId + 1
      }));
    } else {
      this.setState(state => ({
        images: this.state.images,
        selectedImageId: 0
      }));
    }
  };
}

export default withRouter(Standby);
