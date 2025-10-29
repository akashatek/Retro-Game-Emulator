import { NESMEM } from "./NESMEM.js";

export class NESPPU {
    constructor(emu) {
        this.emu = emu;
        this.reg = new NESMEM(8);
        this.vram = new NESMEM(2024);
        this.palette = new NESMEM(32);
        this.oam = new NESMEM(32);
    }

    async powerOn() {
        this.reg = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ];
    }

    patternTable2bppBitmapTileId(chrRomId, tileId) {
        let buffer = new ArrayBuffer(8 * 8 * 2);
        let bytes = new Uint16Array(buffer);
        for(let line = 0; line < 8; line ++) {
            const left = this.emu.dsk.chrRoms[chrRomId][tileId * 16 + line * 2];
            const right = this.emu.dsk.chrRoms[chrRomId][(tileId * 16 + 8) + line * 2];
            let newWord = 0b0000000000000000;
            for(let bit = 0; bit < 8; bit++) {
                const mask = (1 << bit);
                newWord = newWord | ((left & mask) << (bit * 2));
                newWord = newWord | ((right & mask) << (bit * 2 + 1));
                bytes[line * 8 + bit] = newWord;
            }
        }
        return bytes;
    }

    bitmap2bppTileImage(bytes) {
        const palette = [ 
            { "red": 0, "green": 0, "blue": 0, "alpha": 255 },
            { "red": 85, "green": 85, "blue": 85, "alpha": 255 },
            { "red": 170, "green": 170, "blue": 170, "alpha": 255 },
            { "red": 255, "green": 255, "blue": 255, "alpha": 255 }];

        const imageData = this.emu.context.createImageData(8, 8);
        const data = imageData.data;

        for(let id = 0; id < bytes.length; id++) {
            for(let bit = 0; bit < 4; bit++) {
                const mask = (0b00000011 << (6 - bit*2));
                const value = (bytes[id] & mask) >> (6 - bit *2);
                data[id * 4] = palette[value]["red"];
                data[id * 4 + 1] = palette[value]["green"];
                data[id * 4 + 2] = palette[value]["blue"];
                data[id * 4 + 3] = palette[value]["alpha"];
            }
        }

        return imageData;
    }
}