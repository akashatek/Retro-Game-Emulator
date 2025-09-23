import { NESMEM } from './nesmem.js';

export class NESPPU {
    constructor() {
        this.bus = null;
        this.vram = new NESMEM(0x0800); // 2KB of VRAM.
        // PPU Registers
        this.status = 0;
        this.ctrl = 0;
        this.mask = 0;
        // PPU internal memory structures
        this.nametables = new NESMEM(0x0800);
        this.palettes = new NESMEM(0x0020);
        this.oam = new NESMEM(0x0100);
    }

    /**
     * Connects the PPU to the PPU bus.
     * @param {PPUBUS} bus
     */
    connectBus(bus) {
        this.bus = bus;
    }

    /**
     * Reads a byte from a PPU register.
     * @param {number} address
     * @returns {number} The value read from the register.
     */
    readRegister(address) {
        // TODO: Implement PPU register read logic.
        return 0;
    }

    /**
     * Writes a byte to a PPU register.
     * @param {number} address
     * @param {number} value
     */
    writeRegister(address, value) {
        // TODO: Implement PPU register write logic.
    }

    /**
     * Renders a single frame to the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    renderFrame(ctx) {
        // TODO: Implement PPU rendering logic.
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 256, 240);
        console.log('PPU is rendering a frame.');
    }
}
