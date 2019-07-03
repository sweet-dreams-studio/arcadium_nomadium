import * as path from "path";
import * as React from "react";
import * as fs from "fs";
import { IGame } from "../../services/games/models/iGame";

export interface ISlide {
  key: string;
  content: JSX.Element;
}

export function generateSlides(
  games: Map<string, IGame[]>
): Map<string, ISlide[]> {
  const map = new Map<string, ISlide[]>();

  for (const genre of Array.from(games.keys())) {
    const array: ISlide[] = [];
    for (const game of games.get(genre)) {
      const imagePath = path.join(
        game.gameFolderPath,
        game.presentation.jacket.path
      );

      array.push({
        key: game.name,
        content: (
          <img
            src={`data:image/${
              game.presentation.jacket.extension
            };base64,${fs.readFileSync(imagePath).toString("base64")}`}
          />
        )
      });
    }
    map.set(genre, array);
  }

  return map;
}
