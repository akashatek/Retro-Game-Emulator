// NESBUS class: Manages the system bus for communication between the CPU and other components.
// It handles memory reads and writes, directing them to the appropriate hardware.

export default class NESBUS {
    constructor(nesCpu, nesPpu) {
        // The NES has 2KB of internal RAM, which is mirrored.
        this.ram = new Uint8Array(0x0800); 

        // The bus needs access to the CPU and PPU to orchestrate their cycles.
        this.nesCpu = nesCpu;
        this.nesPpu = nesPpu;
        console.log("NESBUS initialized.");
    }

    /**
     * Reads a byte from the specified address on the bus.
     * @param {number} address The 16-bit address to read from.
     * @returns {number} The 8-bit value at the address.
     */
    cpuRead(address) {
        // Map CPU addresses to the correct hardware component.
        if (address >= 0x0000 && address <= 0x1FFF) {
            // RAM and its mirrors ($0000-$1FFF)
            return this.ram[address & 0x07FF];
        }
        
        // For now, return a placeholder value for unimplemented address ranges.
        return 0;
    }

    /**
     * Writes a byte to the specified address on the bus.
     * @param {number} address The 16-bit address to write to.
     * @param {number} value The 8-bit value to write.
     */
    cpuWrite(address, value) {
        // Map CPU addresses to the correct hardware component.
        if (address >= 0x0000 && address <= 0x1FFF) {
            // RAM and its mirrors ($0000-$1FFF)
            this.ram[address & 0x07FF] = value;
        }
    }

    /**
     * Executes one CPU cycle and the corresponding PPU cycles.
     */
    step() {
        // The PPU runs at 3 times the CPU clock speed
        this.nesPpu.tick();
        this.nesPpu.tick();
        this.nesPpu.tick();
        this.nesCpu.tick();
    }
    
    /**
     * Powers on the CPU and PPU and initializes the RAM to a default state.
     */
    powerOn() {
        this.nesCpu.powerOn();
        this.nesPpu.powerOn();
        // Clear all internal RAM to 0 on power up.
        this.ram.fill(0);
    }

    /**
     * Resets the CPU and PPU.
     */
    reset() {
        this.nesCpu.reset();
        this.nesPpu.reset();
        // Clear all internal RAM to 0 on reset.
        this.ram.fill(0);
    }
}
