import { NESMEM } from "./NESMEM.js";
import { NESOPC } from "./NESOPC.js";

function hexByte(value) {
    return value.toString(16).padStart(2, '0').toUpperCase();
}

function binByte(value) {
    return value.toString(2).padStart(8, '0').toUpperCase();
}

function hexWord(value) {
    return value.toString(16).padStart(4, '0').toUpperCase();
}

function setBit(value, pos) {
    if (pos < 0 || pos > 7) {
        return;
    }
    const mask = (1 << pos)
    return value | mask;
}

function unsetBit(value, pos) {
    if (pos < 0 || pos > 7) {
        return;
    }
    const mask = (1 << pos)
    return value & ~mask;
}

function setBitValue(value, pos, bit) {
    if (pos < 0 || pos > 7) {
        return;
    }
    const mask = (1 << pos)
    if (bit == 0) {
        return value & ~mask;
    } else if (bit == 1) {
        return value | mask;
    }
}

function getBit(value, pos) {
    const mask = (1 << pos);
    if (value & mask == mask) {
        return 1;
    } else {
        return 0;
    }
}

export class NESCPU {
    constructor(emu) {
        this.emu = emu;

        // 6502 Registers
        this.PC = 0x0000;       // Program Counter
        this.A = 0x00;          // Accumulator
        this.X = 0x00;          // X-Register
        this.Y = 0x00;          // Y-Register
        this.S = 0x00;          // Stack Pointer (starts high in the $0100 page)
        this.P = 0x00;          // Processor Status Register (flags) - NV1BDIZC
        this.FLAG = { "NEG": 7, "OVF": 6, "B": 4, "DEC": 3, "INT": 2, "ZER": 1, "CAR": 0 };

        this.opcodes = NESOPC;
        this.opcode = {};               // Current instruction opcode
    }

    async powerOn() { 
        // Read the Reset Vector from the PRG-ROM at addresses $FFFC (Little-Endian)
        // This is delegated to the NESEMU, which forwards the request to the correct PRG-ROM bank.
        this.PC = this.emu.readWord(0xFFFC);
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.S = 0xFD;                  // Stack Pointer starts at $01FD
        this.P = 0b00100100;            // NV1BDIZC = 0b00100100

        this.opcode = {};

        console.log(`NESCPU: Reset Vector read. PC set to $${hexWord(this.PC)}`);
    }

    async reset() {        
        // Read the Reset Vector from the PRG-ROM at addresses $FFFC (Little-Endian)
        // This is delegated to the NESEMU, which forwards the request to the correct PRG-ROM bank.
        this.PC = this.emu.readWord(0xFFFC);
        this.A = 0x00;
        this.X = 0x00;
        this.Y = 0x00;
        this.S = 0xFD;                  // Stack Pointer starts at $01FD
        this.P = 0b00100100;            // NV1BDIZC = 0b00100100

        this.opcode = {};

        console.log(`NESCPU: Reset Vector read. PC set to $${hexWord(this.PC)}`);
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
        const hex = hexByte(this.emu.readByte(this.PC));
        this.opcode = this.opcodes[hex];
        if (this.opcode == undefined) {
            console.log(`ERROR: opcode not existing 0x${hex}`);
            return;
        }
    }

    // 2. Decode the instruction, determine the addressing mode, and set this.addrAbs
    decode() {
        let bytes = hexByte(this.emu.readByte(this.PC));
        if (this.opcode.bytes >= 2) {
            bytes += " " + hexByte(this.emu.readByte(this.PC + 1));
            if (this.opcode.bytes == 3) {
                bytes += " " + hexByte(this.emu.readByte(this.PC + 2));
            } else {
                bytes += " ..";
            }
        } else {
            bytes += " .. ..";
        }

        let str = ``;
        str += `${hexByte(this.A)} ${hexByte(this.X)} ${hexByte(this.Y)} ${hexByte(this.S)} ${binByte(this.P)} | `;
        str += `${hexWord(this.PC)} : ${bytes} : ${this.opcode.mnemonic} `;
        // if (this.opcode.mode != "IMP") {
        //     if (this.opcode.mode == "IMM") {
        //         str += `0x${hexByte(this.emu.readByte(this.PC + 1))} `;
        //     } else {
        //         let addr = this.addressingMode(this.PC + 1, this.opcode.mode);
        //         if (this.opcode.mode == "IND_Y") {
        //             addr = this.emu.readWord(addr) + this.Y;
        //         }
        //         const value = this.emu.readByte(addr);
        //         str += `0x${hexWord(addr)} = 0x${hexByte(value)} `
        //     }
        // }
        str += `(${this.opcode.mode}) - ${this.opcode.status} \n`;
        console.log(str);
    
        // console.log(`${hexByte(this.A)} ${hexByte(this.X)} ${hexByte(this.Y)} ${hexByte(this.S)} ${binByte(this.P)} | ${hexWord(this.PC)} : ${bytes} : ${this.opcode.mnemonic} (${this.opcode.mode}) - ${this.opcode.status} \n`);
    }

    // 3. Execute the instruction
    execute() {
        // Implementation TBD
        // The execute function performs the instruction's operation 
        // using the fetched data (this.fetched) and calculated address (this.addrAbs)
        let nextPC = this.opcode.bytes;

        // Refrence: https://www.nesdev.org/wiki/Instruction_reference
        switch (this.emu.readByte(this.PC)) {
            // Access
            case 0xA9:      // LDA (IMM)
            case 0xA5:      // LDA (ZP)
            case 0xB5:      // LDA (ZP_X)
            case 0xAD:      // LDA (ABS)
            case 0xBD:      // LDA (ABS_X)
            case 0xB9:      // LDA (ABS_Y)
            case 0xA1:      // LDA (IND_X)
            case 0xB1:      // LDA (IND_Y)
                this.lda();
                break;
            case 0x85:      // STA (ZP)
            case 0x95:      // STA (ZP_X)
            case 0x8D:      // STA (ABS)
            case 0x9D:      // STA (ABS_X)
            case 0x99:      // STA (ABS_Y)
            case 0x81:      // STA (IND_X)
            case 0x91:      // STA (IND_Y)
                this.sta();
                break;
            // Transfer
            // Arithmetic
            case 0xE6:      // INC (Zero Page)
            case 0xF6:      // INC (Zero Page, X)
            case 0xEE:      // INC (Absolute)
            case 0xFE:      // TBD; INC (Absolute, X)
                this.inc();
                break;
            // Shift
            // Bitwise
            // Compare
            // Branch
            case 0x10:
                this.bpl();
                break;
            // Jump
            // Stack
            // Flags
            case 0x78:      // SEI
                this.P = setBit(this.P, this.FLAG["INT"]);
                break;
            case 0xD8:
                this.P = unsetBit(this.P, this.FLAG["DEC"]);
                break;
            // Other
            case 0xEA:      // NOP
                break;
        }

        this.PC += nextPC;
    }

    // 4. Main clock cycle
    clock() {
        this.fetch();
        this.decode();
        this.execute();
    }

    checkNegativeFlag(value) {
        this.P = this.P | (value & this.NEGATIVE_FLAG);
    }

    checkZeroFlag(value) {
        if (value == 0) {
            this.P = this.P | this.ZERO_FLAG;
        } else {
            this.P = this.P & (~this.ZERO_FLAG);
        }
    }

    addressingMode(index, mode) {
        switch (mode) {
            case "ZP":              // Zero Page
                return 0x0000 | (this.emu.readByte(index));
            case "ZP_X":            // Zero Page,X
                return (this.emu.readByte(index) + this.X) & 0xFF;
            case "ZP_X":            // Zero Page,Y
                return (this.emu.readByte(index) + this.Y) & 0xFF;
            case "ABS":             // Absolute
                return this.emu.readWord(index);
            case "ABS_X":           // Absolute,X
                return this.emu.readWord(index) + this.X;
            case "ABS_Y":           // Absolute,Y
                return this.emu.readWord(index) + this.Y;
            case "IND_X":           // (Indirect,X)
                return this.emu.readWord((index + this.X) & 0xFF);
            case "IND_Y":           // (Indirect),Y
                return this.emu.readWord(index);
        }
    }

    lda() {
        if (this.opcode.mode == "IMM") {
            this.A = this.emu.readByte(this.PC + 1);
            return;
        }

        let addr = this.addressingMode(this.PC + 1, this.opcode.mode);
        if (this.opcode.mode == "IND_Y") {
            addr = this.emu.readWord(addr) + this.Y;
        }
        const value = this.emu.readByte(addr);
        this.checkZeroFlag(value);
        this.checkNegativeFlag(value);
    }

    sta() {
        let addr = this.addressingMode(this.PC + 1, this.opcode.mode);
        if (this.opcode.mode == "IND_Y") {
            addr = this.emu.readWord(addr) + this.Y;
        }
        this.emu.writeByte(addr, this.A);
    }

    inc() {
        const addr = this.addressingMode(this.PC + 1, this.opcode.mode);
        const value = this.emu.readByte(addr);
        this.emu.writeByte(addr, (value + 1) & 0xFF);
        this.checkZeroFlag(value);
        this.checkNegativeFlag(value);
    }

    bpl() {
        if (this.P["NEG"] == 1) {
            return;
        } 
        const value = this.emu.readByte(this.PC + 1);

    }
}