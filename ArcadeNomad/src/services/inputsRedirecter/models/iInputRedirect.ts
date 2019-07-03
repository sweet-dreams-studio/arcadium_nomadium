import { IGamepadKey } from "../../gamepad/models/iGamepadKey";

export interface IInputRedirect {
  keys: string[];
  callback: Function;
  allowForcePress?: boolean;
  timer?: () => number;
}
