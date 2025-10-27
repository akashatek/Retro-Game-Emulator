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

        this.isRunning = false;

        console.log("NESEMU: initialised.");
    }

    powerOn() {
         if (this.isRunning) {
            console.warn("Emulator is already running.");
            return;
        }
        this.isRunning = true;
        
        console.log("SMSEMU: Emulation started.");
        // Use requestAnimationFrame for a stable, browser-friendly loop
        requestAnimationFrame(this.update.bind(this));
    }

    powerOff() {
        this.isRunning = false;
        console.log("SMSEMU: Emulation stopped.");
    }

    update(currentTime) {
        if (!this.isRunning) {
            return;
        }

        this.cpu.update(currentTime);
       
        // Request the next frame
        requestAnimationFrame(this.update.bind(this));
    }

    clock() {
        this.cpu.clock();
    }

    getMemoryMapping(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            // 2KB Internal RAM
            return { "mem": this.wram, "addr": addr % 0x0800 };
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // NES PPU registers
            return { "mem": this.ppu.reg, "addr": (addr - 0x2000) % 0x0008 };
        } else if (addr >= 0x4000 && addr <= 0x4013) {
            // NES APU registers
            return { "mem": this.apu.reg, "addr": (addr - 0x4000) % 0x0018 };
        } else if (addr >= 0x8000 && addr <= 0xBFFF) {
            // NES DSK PRGROMs active Index 0
            return { "mem": this.dsk.prgRoms[this.dsk.active[0]], "addr": (addr - 0x8000) % 0x4000 };
        } else if (addr >= 0xC000 && addr <= 0xFFFF) {
            // NES DSK PRGROMs active Index 1
            return { "mem": this.dsk.prgRoms[this.dsk.active[1]], "addr": (addr - 0xC000) % 0x4000 };
        }
        return null;
    }

    readByte(addr) {
         // TBD: NES I/O Registers

        const map = this.getMemoryMapping(addr);
        if (map != null) {
            return map.mem.readByte(map.addr);
        }
        
        return 0x00;
    }

    writeByte(addr, value) {
        // TBD: NES I/O Registers

        const map = this.getMemoryMapping(addr);
        if (map != null) {
            map.mem.writeByte(map.addr, value);
        }
    }

    readWord(addr) {
         // This delegates the Little-Endian read to the correct component.
         // Since the Reset Vector is at FFFC/FFFD, it will land in the PRG-ROM (this.dsk.prgRoms[1]).

        const map = this.getMemoryMapping(addr);
        if (map != null) {
            return map.mem.readWord(map.addr);
        }
        
        return 0x0000;
    }
}