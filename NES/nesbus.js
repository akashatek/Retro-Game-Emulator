// NESBUS class: Manages the system bus for communication between the CPU and other components.
// It handles memory reads and writes, directing them to the appropriate hardware.

export default class NESBUS {
    constructor(nesMem) {
        // NESBUS takes the NESMEM instance as a dependency to access memory directly.
        this.nesMem = nesMem;
        console.log("NESBUS initialized.");
    }

    /**
     * Reads a byte from the specified address on the bus.
     * @param {number} address The 16-bit address to read from.
     * @returns {number} The 8-bit value at the address.
     */
    cpuRead(address) {
        // For now, simply read directly from memory.
        // TODO: Implement logic to route reads to PPU registers, APU, and controller inputs.
        return this.nesMem.read(address);
    }

    /**
     * Writes a byte to the specified address on the bus.
     * @param {number} address The 16-bit address to write to.
     * @param {number} value The 8-bit value to write.
     */
    cpuWrite(address, value) {
        // For now, simply write directly to memory.
        // TODO: Implement logic to route writes to PPU registers, APU, and controller inputs.
        this.nesMem.write(address, value);
    }
}
