export class NESMEM {
    /**
     * Represents a block of memory for the NES.
     * @param {number} length The size of the memory bank in bytes.
     * @param {number} offset The starting memory address of this bank.
     */
    constructor(length, offset = 0) {
        this.ram = new Uint8Array(length);
        this.offset = offset;
    }

    /**
     * Reads a byte from the specified address.
     * @param {number} address The memory address to read from.
     * @returns {number} The 8-bit value at the address.
     */
    read(address) {
        // We must apply the offset to get the correct index in our local array.
        return this.ram[address - this.offset];
    }

    /**
     * Writes a byte to the specified address.
     * @param {number} address The memory address to write to.
     * @param {number} value The 8-bit value to write.
     */
    write(address, value) {
        // We must apply the offset to get the correct index in our local array.
        this.ram[address - this.offset] = value;
    }
}
