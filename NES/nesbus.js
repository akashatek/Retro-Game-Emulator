export class CPUBUS {
    /**
     * Represents the CPU's 16-bit bus, connecting the CPU to main memory and ROM.
     * @param {NESCPU} cpu The CPU instance.
     * @param {NESPPU} ppu The Picture Processing Unit.
     * @param {NESDSK} dsk The disk/cartridge component.
     */
    constructor(cpu, ppu, dsk) {
        this.cpu = cpu;
        this.ppu = ppu;
        this.dsk = dsk;
    }

    /**
     * Reads a byte from the specified address. Handles memory mapping.
     * @param {number} address
     * @returns {number} The byte read from memory.
     */
    read(address) {
        // TODO: Implement the full NES memory map for reads.
        console.log(`CPUBUS Read: Address $${address.toString(16).padStart(4, '0')}`);
        return 0;
    }

    /**
     * Writes a byte to the specified address. Handles memory mapping.
     * @param {number} address
     * @param {number} value
     */
    write(address, value) {
        // TODO: Implement the full NES memory map for writes.
        console.log(`CPUBUS Write: Address $${address.toString(16).padStart(4, '0')} with value $${value.toString(16).padStart(2, '0')}`);
    }
}

export class PPUBUS {
    /**
     * Represents the PPU's 8-bit bus, connecting the PPU to its memory.
     * @param {NESPPU} ppu The PPU instance.
     * @param {NESDSK} dsk The disk/cartridge component.
     */
    constructor(ppu, dsk) {
        this.ppu = ppu;
        this.dsk = dsk;
    }

    /**
     * Reads a byte from the PPU's address space.
     * @param {number} address
     * @returns {number} The byte read from memory.
     */
    read(address) {
        // TODO: Implement the full PPU memory map for reads.
        console.log(`PPUBUS Read: Address $${address.toString(16).padStart(4, '0')}`);
        return 0;
    }

    /**
     * Writes a byte to the PPU's address space.
     * @param {number} address
     * @param {number} value
     */
    write(address, value) {
        // TODO: Implement the full PPU memory map for writes.
        console.log(`PPUBUS Write: Address $${address.toString(16).padStart(4, '0')} with value $${value.toString(16).padStart(2, '0')}`);
    }
}
