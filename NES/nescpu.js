import { NESMEM } from './nesmem.js';

export class NESCPU {
    constructor() {
        this.bus = null;
        this.mem = new NESMEM(0x0800); // 2KB of CPU WRAM.
        
        // 6502 registers
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.PC = 0;
        this.SP = 0;
        this.flags = { N: 0, V: 0, B: 0, D: 0, I: 0, Z: 0, C: 0 };
    }

    /**
     * Connects the CPU to the main bus.
     * @param {CPUBUS} bus
     */
    connectBus(bus) {
        this.bus = bus;
    }

    /**
     * Resets the CPU to its initial power-on state.
     */
    reset() {
        // TODO: Implement a proper reset sequence and set PC from the reset vector.
        console.log("CPU Reset called.");
        this.PC = 0xC000; // Placeholder for now.
    }

    /**
     * Fetches, decodes, and executes one instruction.
     */
    emulateCycle() {
        // TODO: Implement fetch, decode, and execute logic for one instruction.
        console.log(`CPU is at PC: $${this.PC.toString(16).padStart(4, '0')}`);
    }
}
