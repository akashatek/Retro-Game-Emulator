// NESCPU class: Manages the 6502 processor state and execution.
// It contains all the registers and logic for fetching, decoding, and executing opcodes.

export default class NESCPU {
    constructor(nesBus) {
        // The CPU needs access to the bus to read and write to memory.
        this.nesBus = nesBus;
        
        // 6502 Registers
        this.PC = 0x0000; // Program Counter (16-bit)
        this.SP = 0xFD;    // Stack Pointer (8-bit)
        this.A  = 0x00;    // Accumulator (8-bit)
        this.X  = 0x00;    // Index Register X (8-bit)
        this.Y  = 0x00;    // Index Register Y (8-bit)

        // 6502 Flags (Status Register)
        // N - Negative
        // V - Overflow
        // - - ignored
        // B - Break
        // D - Decimal
        // I - Interrupt
        // Z - Zero
        // C - Carry
        this.status = {
            N: false,
            V: false,
            B: false,
            D: false,
            I: false,
            Z: false,
            C: false,
        };

        console.log("NESCPU initialized.");
    }

    /**
     * Powers on the CPU, resetting all registers.
     */
    powerOn() {
        console.log("NESCPU powering on.");
        this.reset();
    }

    /**
     * Resets the CPU to its initial state.
     */
    reset() {
        console.log("NESCPU is resetting.");
        this.A = this.X = this.Y = 0;
        this.SP = 0xFD;
        this.status.I = true;
        
        // Read the reset vector from memory addresses $FFFC and $FFFD
        const lowByte = this.nesBus.cpuRead(0xFFFC);
        const highByte = this.nesBus.cpuRead(0xFFFD);
        this.PC = (highByte << 8) | lowByte;
    }

    /**
     * Simulates one CPU clock tick.
     */
    tick() {
        // For now, this is a placeholder. A real tick would
        // fetch an instruction and execute it.
        this.readPC();
    }

    /**
     * Reads a byte from the bus using the CPU's program counter.
     * @returns {number} The 8-bit value read from memory.
     */
    readPC() {
        const value = this.nesBus.cpuRead(this.PC);
        this.PC++;
        return value;
    }
}
