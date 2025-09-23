import NESMEM from './nesmem.js';
import NESBUS from './nesbus.js';
import NESDSK from './nesdsk.js';
import NESCPU from './nescpu.js';

export default class NESPPU {
    constructor(nesBus, display) {
        this.nesBus = nesBus;
        this.display = display;

        // PPU Registers
        this.CTRL = 0x00;
        this.MASK = 0x00;
        this.STATUS = 0x00;
        this.OAMADDR = 0x00;
        this.OAMDATA = 0x00;
        this.SCROLL = 0x00;
        this.ADDR = 0x00;
        this.DATA = 0x00;

        console.log("NESPPU initialized.");
    }

    /**
     * Simulates one PPU clock tick.
     */
    tick() {
        // PPU clock logic goes here.
    }
}
