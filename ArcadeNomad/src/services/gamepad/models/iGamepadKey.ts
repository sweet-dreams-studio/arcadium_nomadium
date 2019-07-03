export enum IGamepadKey {
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  BOTTOM_LEFT,
  RIGHT,
  LEFT,
  TOP_RIGHT,
  TOP_LEFT,
  CENTER,
  SELECT,
  START
}

export enum IGamePadKeyDirection {
  UP,
  DOWN
}

export interface IGamepadInput {
  id: number;
  key: string;
  direction: IGamePadKeyDirection;
}
