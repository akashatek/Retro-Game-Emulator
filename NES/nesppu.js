import NESBUS from './nesbus.js';
import NESDSK from './nesdsk.js';
import NESCPU from './nescpu.js';

export default class NESPPU {
    constructor(nesBus, nesDsk, display) {
        // The NES PPU has its own address space (VRAM).
        // It has 2KB of internal VRAM for nametables, which is mirrored.
        this.vram = new Uint8Array(0x0800);
        // It also has a 32-byte palette RAM.
        this.palettes = new Uint8Array(0x20);

        this.nesBus = nesBus;
        this.nesDsk = nesDsk; // PPU needs access to the CHR-ROM
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
     * Reads a byte from the PPU's address space.
     * @param {number} address The 16-bit address to read from.
     * @returns {number} The 8-bit value at the address.
     */
    ppuRead(address) {
        // Wrap address to 0x3FFF (14-bit address space)
        address &= 0x3FFF;

        if (address >= 0x0000 && address <= 0x1FFF) {
            // Pattern tables are typically read-only from the cartridge.
            // For now, we only support Mapper 0.
            return this.nesDsk.chrRom[address];
        } else if (address >= 0x2000 && address <= 0x3EFF) {
            // Nametables and their mirrors.
            return this.vram[address & 0x07FF];
        } else if (address >= 0x3F00 && address <= 0x3F1F) {
            // Palette RAM and its mirrors
            address &= 0x1F;
            // Background and Sprite palette mirroring
            if (address === 0x10 || address === 0x14 || address === 0x18 || address === 0x1C) {
                address &= 0x0F;
            }
            return this.palettes[address];
        }
        
        return 0;
    }

    /**
     * Writes a byte to the PPU's address space.
     * @param {number} address The 16-bit address to write to.
     * @param {number} value The 8-bit value to write.
     */
    ppuWrite(address, value) {
        address &= 0x3FFF;

        if (address >= 0x0000 && address <= 0x1FFF) {
            // Pattern tables are typically read-only from the cartridge.
            // If CHR-RAM is present, this is where it would be written to.
            // For now, we do nothing.
        } else if (address >= 0x2000 && address <= 0x3EFF) {
            // Nametables and their mirrors
            this.vram[address & 0x07FF] = value;
        } else if (address >= 0x3F00 && address <= 0x3F1F) {
            // Palette RAM and its mirrors
            address &= 0x1F;
            // Background and Sprite palette mirroring
            if (address === 0x10 || address === 0x14 || address === 0x18 || address === 0x1C) {
                address &= 0x0F;
            }
            this.palettes[address] = value;
        }
    }
    
    /**
     * Powers on the PPU, resetting all registers and clearing its VRAM.
     */
    powerOn() {
        console.log("NESPPU powering on.");
        this.reset();
    }

    /**
     * Resets the PPU to its initial state.
     */
    reset() {
        console.log("NESPPU is resetting.");
        this.CTRL = this.MASK = this.STATUS = this.OAMADDR = this.OAMDATA = this.SCROLL = this.ADDR = this.DATA = 0;
        this.vram.fill(0);
        this.palettes.fill(0);
        // TODO: Reset other PPU-specific state.
    }

    /**
     * Simulates one PPU clock tick.
     */
    tick() {
        // TODO: Implement PPU tick logic.
    }
}
