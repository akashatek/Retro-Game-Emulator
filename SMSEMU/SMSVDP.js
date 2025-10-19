import { SMSEMU } from './SMSEMU.js';
import { SMSMEM } from './SMSMEM.js';

export class SMSVDP {
    constructor(emu) {
        this.EMU = emu;
        this.MEM = new SMSMEM(16 * 1024);
    }

    async poweron() {
        await this.reset();
    }

    async reset() {

    }

    tick() {

    }
} 