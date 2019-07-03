import { IGamePadKeyDirection, IGamepadInput } from "./models/iGamepadKey";
import { inputStream$ } from "./streams";

export abstract class ControllerHandler {
  protected addInputToStream(id: number, key: string, direction: IGamePadKeyDirection): void {
    if (key) {
      const input: IGamepadInput = {
        id,
        key,
        direction
      };
      inputStream$.next(input);
    }
  }
}
