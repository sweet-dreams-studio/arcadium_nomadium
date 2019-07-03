import {Key} from "./key";

export interface IKeylib {
    press(key: Key): boolean;
    release(key: Key): boolean;
}
