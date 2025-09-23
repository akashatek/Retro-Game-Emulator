import NESBUS from './nesbus.js';

export default class NESDSK {
    constructor() {
        console.log("NESDSK initialized.");
        this.prgRomCount = 0;
        this.chrRomCount = 0;
        this.prgRom = [];
        this.chrRom = [];
        this.mapper = 0;

        // UI elements for displaying ROM information
        this.mapperNumberSpan = document.getElementById('mapper-number');
        this.prgRomCountSpan = document.getElementById('prg-rom-count');
        this.prgRomSizeSpan = document.getElementById('prg-rom-size');
        this.chrRomCountSpan = document.getElementById('chr-rom-count');
        this.chrRomSizeSpan = document.getElementById('chr-rom-size');

        this.patternTable1Canvas = document.getElementById('pattern-table1-canvas');
        this.patternTable2Canvas = document.getElementById('pattern-table2-canvas');
    }

    /**
     * Loads the ROM file and parses the iNES header.
     * @param {File} file The .nes ROM file.
     */
    async powerOn(file) {
        if (!file) {
            console.error('No ROM file selected.');
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            const data = new Uint8Array(buffer);
            console.log("ROM file loaded successfully.");

            // Check the iNES header (bytes 0-3)
            if (data[0] !== 0x4E || data[1] !== 0x45 || data[2] !== 0x53 || data[3] !== 0x1A) {
                throw new Error("Invalid NES ROM file header.");
            }

            // Get PRG-ROM and CHR-ROM size from header
            this.prgRomCount = data[4];
            this.chrRomCount = data[5];

            // Get mapper number from header
            this.mapper = ((data[7] >> 4) << 4) | (data[6] >> 4);

            if (this.mapper !== 0) {
                throw new Error(`Mapper ${this.mapper} is not supported. This emulator only supports Mapper 0.`);
            }

            console.log(`Mapper: ${this.mapper}`);
            console.log(`PRG-ROM: ${this.prgRomCount} banks`);
            console.log(`CHR-ROM: ${this.chrRomCount} banks`);

            // Extract PRG-ROM and CHR-ROM from the file
            const prgRomStart = 16;
            const chrRomStart = prgRomStart + (this.prgRomCount * 16384);

            this.prgRom = data.slice(prgRomStart, chrRomStart);
            this.chrRom = data.slice(chrRomStart, chrRomStart + (this.chrRomCount * 8192));

            this.updateUI();
            this.drawPatternTables();

        } catch (error) {
            console.error(`ROM loading error: ${error.message}`);
        }
    }

    /**
     * Updates the UI with information from the loaded ROM.
     */
    updateUI() {
        if (this.mapperNumberSpan) {
            this.mapperNumberSpan.textContent = this.mapper;
        }
        if (this.prgRomCountSpan) {
            this.prgRomCountSpan.textContent = this.prgRomCount;
        }
        if (this.prgRomSizeSpan) {
            this.prgRomSizeSpan.textContent = this.prgRomCount * 16 + "KB";
        }
        if (this.chrRomCountSpan) {
            this.chrRomCountSpan.textContent = this.chrRomCount;
        }
        if (this.chrRomSizeSpan) {
            this.chrRomSizeSpan.textContent = this.chrRomCount * 8 + "KB";
        }
    }

    /**
     * Draws the CHR-ROM pattern tables onto their respective canvases.
     */
    drawPatternTables() {
        if (this.chrRom.length > 0) {
            // A single 8KB CHR-ROM bank contains two 4KB pattern tables.
            // For Mapper 0, we always use the first two tables.
            this.drawPatternTable(this.patternTable1Canvas, 0); // Draws the first 4KB table
            this.drawPatternTable(this.patternTable2Canvas, 4096); // Draws the second 4KB table
        }
    }

    /**
     * Helper function to draw a single pattern table.
     * @param {HTMLCanvasElement} canvas The canvas to draw on.
     * @param {number} offset The byte offset in chrRom to start drawing from.
     */
    drawPatternTable(canvas, offset) {
        const ctx = canvas.getContext('2d');
        const palette = ['#FFFFFF', '#C0C0C0', '#606060', '#000000'];

        for (let tileY = 0; tileY < 16; tileY++) {
            for (let tileX = 0; tileX < 16; tileX++) {
                const tileIndex = (tileY * 16) + tileX;
                const tileOffset = offset + (tileIndex * 16);

                for (let y = 0; y < 8; y++) {
                    const plane0 = this.chrRom[tileOffset + y];
                    const plane1 = this.chrRom[tileOffset + y + 8];

                    for (let x = 0; x < 8; x++) {
                        const pixel = ((plane0 >> (7 - x)) & 1) | (((plane1 >> (7 - x)) & 1) << 1);
                        ctx.fillStyle = palette[pixel];
                        ctx.fillRect((tileX * 8) + x, (tileY * 8) + y, 1, 1);
                    }
                }
            }
        }
    }
}
