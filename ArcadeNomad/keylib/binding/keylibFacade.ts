import bindings from "bindings";
import {Key} from "./key";
import {IKeylib} from "./iKeylib";

class KeylibFacade {

    private readonly keylib: IKeylib | null;

    constructor() {
        this.keylib = process.platform === "win32" ? bindings("keylib") : null;
    }

    public press(key: Key): boolean {
        if (!this.isValid) { return false; }
        return this.keylib!.press(key);
    }

    public release(key: Key): boolean {
        if (!this.isValid) { return false; }
        return this.keylib!.release(key);
    }

    public click(key: Key): boolean {
        return this.press(key) && this.release(key);
    }

    private get isValid(): boolean {
        return this.keylib != null;
    }
}

export const keylib = new KeylibFacade();
export {Key};
