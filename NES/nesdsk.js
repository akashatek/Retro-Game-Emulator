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
                console.error("Invalid iNES header. This is not a valid NES ROM.");
                return;
            }

            // Get ROM sizes from the header
            this.prgRomCount = data[4]; // 16KB PRG-ROM banks
            this.chrRomCount = data[5]; // 8KB CHR-ROM banks
            this.mapper = ((data[7] & 0xF0) | (data[6] >> 4));

            console.log(`PRG-ROM banks: ${this.prgRomCount}`);
            console.log(`CHR-ROM banks: ${this.chrRomCount}`);
            console.log(`Mapper: ${this.mapper}`);

            // Update UI
            this.mapperNumberSpan.textContent = this.mapper;
            this.prgRomCountSpan.textContent = this.prgRomCount;
            this.prgRomSizeSpan.textContent = `${this.prgRomCount * 16} KB`;
            this.chrRomCountSpan.textContent = this.chrRomCount;
            this.chrRomSizeSpan.textContent = `${this.chrRomCount * 8} KB`;

            // Extract PRG-ROM and CHR-ROM from the file data
            const prgRomSize = this.prgRomCount * 16 * 1024;
            const chrRomSize = this.chrRomCount * 8 * 1024;

            const prgRomStart = 16;
            const chrRomStart = prgRomStart + prgRomSize;

            this.prgRom = data.subarray(prgRomStart, prgRomStart + prgRomSize);
            this.chrRom = data.subarray(chrRomStart, chrRomStart + chrRomSize);
            
            this.drawPatternTables();
        } catch (error) {
            console.error("Failed to load or parse the ROM file:", error);
        }
    }

    /**
     * Draws the PPU pattern tables from the CHR-ROM data to the canvases.
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
                        const pixel = (((plane1 >> (7 - x)) & 1) << 1) | ((plane0 >> (7 - x)) & 1);
                        ctx.fillStyle = palette[pixel];
                        ctx.fillRect((tileX * 8) + x, (tileY * 8) + y, 1, 1);
                    }
                }
            }
        }
    }
}
