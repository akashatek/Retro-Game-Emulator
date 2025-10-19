import { SMSDSK } from './SMSDSK.js';
import { SMSVDP } from './SMSVDP.js';
import { SMSCPU } from './SMSCPU.js';

export class SMSEMU {    
    constructor(canvasId) {
        this.screenWidth = 256;
        this.screenHeight = 192;
        this.backgroundColor = 'black';

        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;

        this.context.imageSmoothingEnabled = false; // Disable smoothing for pixel art
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Component instantiation, passing 'this' (the EMU instance) as the bus
        this.DSK = new SMSDSK(this);
        this.VDP = new SMSVDP(this);
        this.CPU = new SMSCPU(this);
        
        // Calculate the fixed time interval for one tick
        this.clock = 53203424;                              // PAL 53.2034 MHz clock
        this.timer = 1 / (this.clock * 1000000 / 15);       // CPU Z80 runs at 3.5 MHz (PAL clock / 15)
        this.vdpCycleCount = 3;                             // VDP runs 3 times slower than CPU Z80
        this.time = 0;
    }

    async poweron() {
        console.log("SMSEMU: Powering On...");
        await this.DSK.poweron();
        await this.VDP.poweron();
        await this.CPU.poweron();
        console.log("SMSEMU: System ready.");
    }
    
    /**
     * Starts the main emulation loop using high-resolution timing.
     */
    start() {
        if (this.isRunning) {
            console.warn("Emulator is already running.");
            return;
        }
        this.isRunning = true;
        this.timeAccumulator = 0;
        this.previousTime = performance.now(); 
        this.vdpCycleCount = 0; 
        
        console.log("SMSEMU: Starting time-based emulation loop.");
        
        // Use requestAnimationFrame for a stable, browser-friendly loop
        requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Stops the main emulation loop.
     */
    stop() {
        this.isRunning = false;
        console.log("SMSEMU: Emulation stopped.");
    }
    
    /**
     * Deterministic function that executes a fixed block of CPU/VDP cycles.
     * This is the heart of the emulator's timing logic.
     */
    tick() {
        // --- 1. Execute CPU Instruction ---
        this.CPU.tick();
        
        // --- 2. Update VDP based on CPU cycles ---
        // For every 3 CPU cycles, the VDP performs 1 tick (SMS clock ratio)
        this.vdpCycleCount -= 1;
        while (this.vdpCycleCount <= 0) {
            this.VDP.tick();
            this.vdpCycleCount = 3;
        }
    }

    /**
     * The main animation loop. It synchronizes the fixed timestep (tick) 
     * with the variable browser framerate (update).
     * @param {DOMHighResTimeStamp} currentTime - The time provided by requestAnimationFrame (in ms).
     */
    update(currentTime) {
        if (!this.isRunning) {
            return;
        }

        if (this.previousTime === 0) {
             this.previousTime = currentTime;
        }
        
        this.currentTime = currentTime;
        this.deltaTime = this.currentTime - this.previousTime;
        
        // --- 2. Execute Fixed Ticks ---
        // Keep running ticks until the accumulated time falls below the fixed tick interval.
        this.time += this.deltaTime;
        if (this.time > this.timer) {
            this.tick();
            this.time = 0;
        }
        
        this.previousTime = currentTime; // Update the previous time for the next call
        // Request the next frame
        requestAnimationFrame(this.update.bind(this));
    }
    
    readByte(addr) {
        if (addr >= 0x0000 && addr < 0x4000) {
            return this.DSK.readByte(addr, 0);
        } else if (addr >= 0x4000 && addr < 0x8000) {
            return this.DSK.readByte(addr, 1);
        } else if (addr >= 0x8000 && addr <= 0xC000) {
            return this.DSK.readByte(addr, 2);
        }

        return this.MEM.readByte(addr);
    }

    writeByte(addr, value) {
        if (addr >= 0x0000 && addr < 0x4000) {
            this.DSK.writeByte(addr, value, 0);
            return;
        } else if (addr >= 0x4000 && addr < 0x8000) {
            this.DSK.writeByte(addr, value, 1);
            return;
        } else if (addr >= 0x8000 && addr <= 0xC000) {
            this.DSK.writeByte(addr, value, 2);
            return;
        }

        this.MEM.writeByte(addr, value);
    }
}
