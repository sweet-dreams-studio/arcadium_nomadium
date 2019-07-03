import * as React from "react";
import * as fs from "fs";
import styled from "@emotion/styled";
import Image from "./image";
import * as path from "path";
import Rating from "react-rating";
import ReactPlayer from "react-player";
import { IGame } from "../../../services/games/models/iGame";
import { IRating } from "../../../pages/rating/models/iRating";

const Wrapper = styled.div(() => ({
  position: "fixed",
  bottom: 0,
  width: "70%",
  maxWidth: 900,
  marginBottom: 100,
  height: "calc(60% - 70px)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "sans-serif",
  alignItems: "center"
}));

const VideoWrapper = styled.div(() => ({
  borderRadius: 5,
  zIndex: 1,
  overflow: "hidden",
  "& video": {
    objectFit: "cover"
  }
}));

const InfoWrapper = styled.div({
  boxShadow: "0 36px 53px -18px rgba(0,0,0,0.2)",
  backgroundColor: "white",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 5,
  position: "absolute",
  width: "80%",
  bottom: -70,
  zIndex: 2
});

const InfoTitle = styled.div({
  fontWeight: "bold",
  fontSize: "1.5rem"
});

const BottomInfo = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%"
});

const DeveloperLink = styled.a({
  overflow: "hidden",
  maxWidth: "50%",
  textDecoration: "none"
});

interface InfoProps {
  game: IGame;
  rating: IRating;
}

class InfoComponent extends React.PureComponent<InfoProps> {
  render() {
    const { game, rating } = this.props;
    console.log(this.props)
    let imagePath: string = path.join(
      game.gameFolderPath,
      game.presentation.jacket.path
    );
    let imageExtension = game.presentation.jacket.extension;
    let image: string = "";
    let videoPath: string = game.presentation.video;

    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    if (videoPath && !pattern.test(videoPath)) {
      videoPath = path.join(game.gameFolderPath, game.presentation.video);
      videoPath = videoPath.replace(/\\/g, "/");
    }

    if (game.presentation.pictures) {
      const imageConfig = game.presentation.pictures[0];
      imagePath = path.join(game.gameFolderPath, imageConfig.path);
      imageExtension = imageConfig.extension;
    }

    return (
      <Wrapper>
        {game.presentation.video ? (
          <ReactPlayer
            width="100%"
            height="100%"
            url={videoPath}
            playing
            wrapper={VideoWrapper}
          />
        ) : (
          <Image
            imagePath={imagePath}
            imageExtension={imageExtension}
            style={{ height: "100%", width: "100%", borderRadius: 5 }}
          />
        )}
        <InfoWrapper>
          <InfoTitle>{game.name}</InfoTitle>
          <div>
            {game.informations.editor} - {game.genres[0]} - PEGI{" "}
            {game.informations.pegi}
          </div>
          <BottomInfo>
            {rating ? (
              <div style={{ color: "#FDD835" }}>
                <Rating
                  initialRating={rating.average}
                  emptySymbol="fa fa-star-o fa-2x"
                  fullSymbol="fa fa-star fa-2x"
                  readonly
                />
              </div>
            ) : (
              <div />
            )}
            <DeveloperLink href={game.informations.link}>
              {game.informations.link}
            </DeveloperLink>
          </BottomInfo>
        </InfoWrapper>
      </Wrapper>
    );
  }
}

export default InfoComponent;
