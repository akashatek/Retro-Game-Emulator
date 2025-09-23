export default class NESDSK {
    constructor(nesEmu) {
        this.nesEmu = nesEmu;
        console.log("NESDSK initialized.");
    }

    /**
     * Handles the power-on sequence and initiates ROM loading.
     * @param {File} file The selected ROM file.
     */
    powerOn(file) {
        console.log("NESDSK is powering on.");
        // Call the internal method to load the ROM
        this.loadRom(file);
    }

    /**
     * Handles the ROM file loading.
     * @param {File} file The selected ROM file.
     */
    loadRom(file) {
        // TODO: Implement the logic to read the file and parse the iNES header.
        console.log("NESDSK is loading the ROM file.");
    }
}
