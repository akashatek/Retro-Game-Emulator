import { NESMEM } from "./NESMEM.js";

export class NESPPU {
    constructor(emu) {
        this.emu = emu;
        this.reg = new NESMEM(0x8);
    }
}