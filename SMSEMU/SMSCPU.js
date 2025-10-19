import { SMSEMU } from './SMSEMU.js';

export class SMSCPU {
    constructor(emu) {
        this.EMU = emu;
        this.registers = { 
            "AF": 0x0000, "BC": 0x000, "DE": 0x0000, "HL": 0x0000,
            "AF'": 0x0000, "BC'": 0x000, "DE'": 0x0000, "HL'": 0x0000,
            "IX": 0x0000, "IY": 0x0000, "SP": 0x0000, "PC": 0x0000,
            "I": 0x00, "R": 0x00
        };
        this.cycles = 0;
        this.opc = 0x00;
    }

    async poweron() {
        await this.reset();
    }

    async reset() {
        this.registers["PC"] = 0x0000;
        this.registers["I"] = 0x00;
        this.registers["R"] = 0x00;
        this.registers["AD"] = 0xFFFF;
        // TBD: IFF1 and IFF2 needs to be cleared
        // TBD: IM set to 0
    }

    tick() {
        if (this.cycles > 0) {
            cycles -=1;
            return;
        }
        this.fetch();
        this.decode();
        this.execute();
    }

    fetch() {
        this.opc = this.EMU.readByte(this.registers.PC);
    }

    decode() {

        switch (this.opc) {
           case 0xED:  // Extended Instruction Set
                executeExtendedInstructionSet();
                break;
            case 0xCB:  // Bit Manipulation Instructtion Set
                executeBitManipulationInstructionSet();
                break;
            case 0xDD:  // Index X Register Instruction Set
                executeIndexXRegisterInstructionSet();
                break;
            case 0xFD:  // Index Y Register Instruction Set
                executeIndexYRegisterInstructionSet();
                break;
            default:    // Primary Instruction Set
                executePrimaryInstructionSet();
                break;
        }
    }

    execute() {
        switch (this.opc) {
            case 0xED:  // Extended Instruction Set
                executeExtendedInstructionSet();
                break;
            case 0xCB:  // Bit Manipulation Instructtion Set
                executeBitManipulationInstructionSet();
                break;
            case 0xDD:  // Index X Register Instruction Set
                executeIndexXRegisterInstructionSet();
                break;
            case 0xFD:  // Index Y Register Instruction Set
                executeIndexYRegisterInstructionSet();
                break;
            default:    // Primary Instruction Set
                executePrimaryInstructionSet();
                break;
        }
    }
} 