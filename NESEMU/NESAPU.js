import { NESMEM } from "./NESMEM.js";

export class NESAPU {
    constructor(emu) {
        this.emu = emu;
        this.reg = new NESMEM(0x13);
    }
}