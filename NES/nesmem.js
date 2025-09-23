export default class NESMEM {
    constructor() {
        // The NES has a 64KB address space (0x0000 to 0xFFFF)
        this.memory = new Uint8Array(0x10000); 
        console.log("NESMEM initialized.");
    }

    /**
     * Reads a single byte from the specified 16-bit address.
     * @param {number} address The 16-bit address to read from.
     * @returns {number} The 8-bit value at the address.
     */
    read(address) {
        // For now, this is a direct read from the memory array.
        // In a more complete emulator, this method would handle memory mapping.
        return this.memory[address];
    }

    /**
     * Writes a single byte to the specified 16-bit address.
     * @param {number} address The 16-bit address to write to.
     * @param {number} value The 8-bit value to write.
     */
    write(address, value) {
        // For now, this is a direct write to the memory array.
        // In a more complete emulator, this method would handle memory mapping.
        this.memory[address] = value;
    }
}
