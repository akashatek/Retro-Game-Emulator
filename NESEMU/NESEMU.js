import { NESMEM } from './NESMEM.js';
import { NESDSK } from './NESDSK.js';
import { NESCPU } from './NESCPU.js';
import { NESPPU } from './NESPPU.js';
import { NESAPU } from './NESAPU.js';

export class NESEMU {
    constructor(canvasId, screenWidth, screenHeight, backgroundColor) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.backgroundColor = backgroundColor;

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;

        this.context.imageSmoothingEnabled = false; // Disable smoothing for pixel art
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.components = {};

        this.wram = new NESMEM(0x800);
        this.dsk = new NESDSK(this);
        this.cpu = new NESCPU(this);
        this.ppu = new NESPPU(this);
        this.apu = new NESAPU(this);

        console.log("NESEMU: initialised.");
    }

    readByte(addr) {
         // TBD: NES I/O Registers

        if (addr >= 0x0000 && addr <= 0x1FFF) {
            // 2KB Internal RAM
            return this.wram.readByte(addr);
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // NES PPU registers
            return this.ppu.reg.readByte(addr - 0x2000);
        } else if (addr >= 0x4000 && addr <= 0x4013) {
            // NES APU registers
            return this.apu.reg.readByte(addr - 0x4000);
        } else if (addr >= 0x8000 && addr <= 0xBFFF) {
            // NES DSK PRGROMs Index 0
            return this.dsk.prgRoms[0].readByte(addr - 0x8000);
        } else if (addr >= 0xC000 && addr <= 0xFFFF) {
            // NES DSK PRGROMs Index 1
            return this.dsk.prgRoms[1].readByte(addr - 0xC000);
        }
        return 0x00;
    }

    writeByte(addr, value) {
        // TBD: NES I/O Registers

        if (addr >= 0x0000 && addr <= 0x1FFF) {
            // 2KB Internal RAM
            this.wram.writeByte(addr, value);
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // NES PPU registers
            this.ppu.reg.writeByte(addr - 0x2000, value);
        } else if (addr >= 0x4000 && addr <= 0x4013) {
            // NES APU registers
            this.apu.reg.writeByte(addr - 0x4000, value);
        } else if (addr >= 0x8000 && addr <= 0xBFFF) {
            // NES DSK PRGROMs Index 0
            this.dsk.prgRoms[0].writeByte(addr - 0x8000, value);
        } else if (addr >= 0xC000 && addr <= 0xFFFF) {
            // NES DSK PRGROMs Index 1
            this.dsk.prgRoms[1].writeByte(addr - 0xC000, value);
        }
        
    }
}