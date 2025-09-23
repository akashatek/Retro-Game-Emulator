import { NESCPU } from './nescpu.js';
import { NESPPU } from './nesppu.js';
import { NESDSK } from './nesdsk.js';
import { CPUBUS, PPUBUS } from './nesbus.js';

export class NESEMU {
    constructor() {
        this.dsk = new NESDSK();
        this.ppu = new NESPPU();
        this.cpu = new NESCPU();

        // Establish the connections between components via the buses
        this.cpuBus = new CPUBUS(this.cpu, this.ppu, this.dsk);
        this.ppuBus = new PPUBUS(this.ppu, this.dsk);

        this.cpu.connectBus(this.cpuBus);
        this.ppu.connectBus(this.ppuBus);
        
        this.running = false;
    }

    /**
     * Loads a ROM file into the emulator's disk.
     * @param {Uint8Array} romData The binary ROM data.
     * @returns {boolean} True if the ROM was loaded successfully, otherwise false.
     */
    loadRom(romData) {
        if (this.dsk.loadRom(romData)) {
            this.cpu.reset();
            return true;
        }
        return false;
    }

    /**
     * The main emulation loop.
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context.
     */
    mainLoop(ctx) {
        if (!this.running) return;

        // A single frame on the NES is 29780 CPU cycles, or 89342 PPU cycles.
        // For simplicity, we'll execute one CPU cycle per frame.
        // This is not timing-accurate, but sufficient for early development.
        this.cpu.emulateCycle();
        this.ppu.renderFrame(ctx);
        
        requestAnimationFrame(() => this.mainLoop(ctx));
    }
}
