import { NESMEM } from "./NESMEM.js";

export class NESDSK {
    constructor(emu) {
        this.emu = emu;
        this.mapper = 0;
        this.prgRoms = [];
        this.prgRomCount = 0;
        this.prgRomSizeKB = 16;
        this.chrRoms = [];
        this.chrRomCount = 0;
        this.chrRomSizeKB = 8;
        this.mirroring = "vertical";
        this.active = [0, 1];
    }

    dump() {
        let str = `NESDSK: \n\tmapper: ${this.mapper}\n\tmirroring: ${this.mirroring}\n`;
        str += `\tPRGROM: ${this.prgRomCount} * ${this.prgRomSizeKB} KB.\n`;
        str += `\tCHRROM: ${this.chrRomCount} * ${this.chrRomSizeKB} KB.\n`;
        console.log(str);
        this.prgRoms.forEach(prgRom => {
            prgRom.hexdump();
        })
    }

    // TBD: trainer, PRG RAM, TV system (PAL / NTSC) not taken into account
    async load(url) {
        const mem = new NESMEM();
        await mem.load(url);

        if (mem.compare(0x0000, 4, [0x4E, 0x45, 0x53, 0x1A]) == false) {
            console.log("NESDSK: not a valid NES ROM header");
            return;
        }

        this.prgRomCount = mem.datas[4];
        this.chrRomCount = mem.datas[5];
        if (mem.datas[6] & 0b00001000 == 0b00001000) {
            this.mirroring = "4 screen";
        } else {
            if (mem.datas[6] & 0b00000001 == 0b00000001) {
                this.mirroring = "horizontal";
            } else {
                this.mirroring = "vertical";
            }
        }
        this.mapper = (mem.datas[7] & 0xF0) | (mem.datas[6] & 0xF0) >> 4;
        
        let offset = 0x0010;
        for(let i=0; i<this.prgRomCount; i++) {
            let prg = new NESMEM();
            prg.reset(mem.datas.slice(offset, offset + (this.prgRomSizeKB * 1024)));
            this.prgRoms.push(prg);
            offset += this.prgRomSizeKB * 1024;
        }

        for(let i=0; i<this.chrRomCount; i++) {
            let chr = new NESMEM();
            chr.reset(mem.datas.slice(offset, offset + (this.chrRomSizeKB * 1024)));
            this.chrRoms.push(chr);
            offset += this.chrRomSizeKB * 1024;
        }
    }
}