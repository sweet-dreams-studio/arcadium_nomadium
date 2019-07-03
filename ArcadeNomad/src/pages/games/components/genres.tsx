import * as React from "react";
import styled from "@emotion/styled";
import { map } from "lodash/fp";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const componentHeight: number = 20;

const GenreDiv = styled.div(
  ({ selectedGenre, genres }: { selectedGenre: number; genres: string[] }) => ({
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    fontFamily: "sans-serif",
    flexDirection: "column",
    alignItems: "center",
    transform: `translateY(${(Math.floor(genres.length / 2) - selectedGenre) *
      componentHeight -
      (genres.length % 2 == 0 ? 10 : 0)}px)`,
    transition: "0.2s ease-out",
    marginRight: 10
  })
);

export default ({ genres, selectedGenre }) => {
  return (
    <div
      style={{
        height: componentHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        flexShrink: 0
      }}
    >
      <div
        style={{
          height: componentHeight,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexShrink: 0
        }}
      >
        <GenreDiv selectedGenre={selectedGenre} genres={genres}>
          {map(
            genre => (
              <div
                style={{ height: componentHeight, flexShrink: 0 }}
                key={genre}
              >
                {genre}
              </div>
            ),
            genres
          )}
        </GenreDiv>
      </div>
      <div
        style={{
          height: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TiArrowSortedUp size={16} />
        <TiArrowSortedDown size={16} />
      </div>
    </div>
  );
};
