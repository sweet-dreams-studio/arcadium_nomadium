import { IRating } from "../../../pages/rating/models/iRating";
import { IGamepadKey } from "../../gamepad/models/iGamepadKey";
import { IDynamicImage } from "../../imagesDisplay/iDynamicImage";

export interface IGame {
  name: string;
  genres: string[];
  gameFolderPath: string;
  exePath: string;
  presentation: {
    jacket: IDynamicImage;
    pictures: IDynamicImage[];
    video: string;
  };
  informations: {
    editor: string;
    pegi: string;
    qrcode: string;
    link: string;
  };
  keybinds: { [keyId in IGamepadKey]: string };
  keyTexts: { [keyId in IGamepadKey]: string };
  rating: IRating;
}
