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
     * Resets the CPU to its initial state.
     */
    reset() {
        console.log("NESCPU is resetting.");
        // TODO: Implement reset logic, including setting initial register values and flags.
    }

    /**
     * Reads a byte from the bus using the CPU's program counter.
     * @returns {number} The 8-bit value read from memory.
     */
    readPC() {
        // TODO: Implement reading from memory at the PC's address.
    }

    /**
     * Executes the next instruction in the program.
     */
    execute() {
        // TODO: Implement the main execution loop for fetching and decoding opcodes.
    }
}
