import { NESMEM } from "./NESMEM.js";
import { NESOPC } from "./NESOPC.js";

export class NESCPU {
    constructor(emu) {
        this.emu = emu;

        // 6502 Registers
        this.A = 0x00;          // Accumulator
        this.X = 0x00;          // X-Register
        this.Y = 0x00;          // Y-Register
        this.S = 0xFD;          // Stack Pointer (starts high in the $0100 page)
        this.PC = 0x0000;       // Program Counter
        this.P = 0b00100100;    // Processor Status Register (flags)

        // Internal State
        this.cycles = 0;        // Cycles consumed by the current instruction
        this.clockCount = 0;    // Total clock cycles for synchronization
        this.fetched = 0x00;    // Data fetched from memory
        this.addrAbs = 0x0000;  // Absolute address determined by addressing mode
        this.addrRel = 0x0000;  // Relative address for branches

        this.opcodes = NESOPC;
        this.opcode = {};       // Current instruction opcode
    }

    reset() {        
        // Read the Reset Vector from the PRG-ROM at addresses $FFFC (Little-Endian)
        // This is delegated to the NESEMU, which forwards the request to the correct PRG-ROM bank.
        this.PC = this.emu.readWordLittleEndian(0xFFFC);

        // Reset all other internal state
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.S = 0xFD; // Stack Pointer starts at $01FD
        this.P = 0b00100100;
        
        this.cycles = 8; // Reset takes 8 cycles
        this.clockCount = 0;
        this.addrAbs = 0x0000;
        this.addrRel = 0x0000;
        this.fetched = 0x00;
        this.opcode = 0x00;

        console.log(`NESCPU: Reset Vector read. PC set to $${this.PC.toString(16).toUpperCase().padStart(4, '0')}`);
    }

    update(currentTime) {
        this.fetch();
        this.decode();
        this.execute();
    }

    // --- CPU Cycle Functions ---

    // 1. Fetch the instruction byte and set this.opcode
    fetch() {
        // Implementation TBD
        // The Program Counter (PC) holds the address of the next instruction
        // Opcode is the byte at the PC address
        const hex = this.emu.readByte(this.PC).toString(16).padStart(2, '0').toUpperCase();
        this.opcode = this.opcodes[hex];
        if (this.opcode == undefined) {
            console.log(`ERROR: opcode not existing 0x${hex}`);
            return;
        }
    }

    // 2. Decode the instruction, determine the addressing mode, and set this.addrAbs
    decode() {
        // Implementation TBD
        // This function will be complex, involving a large switch/lookup table
        // to handle all 256 opcodes.
        // For now, it's a placeholder.
        const addr = this.PC.toString(16).padStart(4, '0').toUpperCase();

        let bytes = this.emu.readByte(this.PC).toString(16).padStart(2, '0').toUpperCase();
        if (this.opcode.bytes >= 2) {
            bytes += " " + this.emu.readByte(this.PC+1).toString(16).padStart(2, '0').toUpperCase();
            if (this.opcode.bytes == 3) {
                bytes += " " + this.emu.readByte(this.PC+2).toString(16).padStart(2, '0').toUpperCase();
            } else {
                bytes += " ..";
            }
        } else {
            bytes += " .. ..";
        }
        

        console.log(`${addr} : ${bytes} : ${this.opcode.mnemonic}\n`);
    }

    // 3. Execute the instruction
    execute() {
        // Implementation TBD
        // The execute function performs the instruction's operation 
        // using the fetched data (this.fetched) and calculated address (this.addrAbs)

        this.PC += this.opcode.bytes;
    }

    // 4. Main clock cycle
    clock() {
        if (this.cycles === 0) {
            // New instruction cycle: fetch, decode, and start execution
            this.fetch();
            this.decode();      // This should set the initial 'this.cycles' count
            this.execute();
        }
        
        this.clockCount++;
        this.cycles--;
    }
}