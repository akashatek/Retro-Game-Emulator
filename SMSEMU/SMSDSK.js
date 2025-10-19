import { SMSEMU } from './SMSEMU.js';
import { SMSMEM } from './SMSMEM.js';

export class SMSDSK {
    constructor(emu) {
        this.EMU = emu;
        this.banks = [];
        this.mapperIds = [0, 1, 2];
        this.text = "";
        this.romSizeKB = 0;
        this.url = "";
    }

    readByte(addr, index) {
        let bankId = this.mapperIds[index];
        return this.banks[bankId].readByte(addr);
    }

    writeByte(addr, value, index) {
        let bankId = this.mapperIds[index];
        this.banks[bankId].writeByte(addr, value);
    }

    async poweron() {
        await this.reset();
    }

    async reset() {
        let mem = new SMSMEM();
        await mem.load(this.url);
    
        // Placeholder for decoding DSK logic
        const decoder = new TextDecoder('utf-8');
        this.text = decoder.decode(mem.datas.slice(0x7FF0, 0x7FF8)); // Decode first 256 bytes as text
        if (this.text != "TMR SEGA") {
            console.error(`Not a valid SMS Disk file header: ${this.text}`);
            return;
        }

        // TBD: checksum, productcode, version, region, etc ...
        switch (mem.datas[0x7FFF] & 0x0F) {
            case 0x00: this.romSizeKB = 256; break;
            case 0x01: this.romSizeKB = 512; break;
            case 0x02: this.romSizeKB = 1024; break;
            case 0x0A: this.romSizeKB = 8; break;
            case 0x0B: this.romSizeKB = 16; break;
            case 0x0C: this.romSizeKB = 32; break;
            case 0x0D: this.romSizeKB = 48; break;
            case 0x0E: this.romSizeKB = 64; break;
            case 0x0F: this.romSizeKB = 128; break;
        }

        for (let i=0; i < Math.floor(this.romSizeKB / 16); i++) {
            let bank = new SMSMEM();
            bank.datas = mem.datas.slice(i * 4000, (i + 1) * 4000 - 1);
            this.banks.push(bank);
        }

        console.log(`SMSDSK load complete: ${this.url}`);
        console.log(`\tHeader: ${this.text}`);
        console.log(`\tSize: ${this.romSizeKB} KB`);
        console.log(`\tBanks: ${this.banks.length} BankIds: ${this.bankIds}`);
    }

    insertRom(url) {
        this.url = url;
    }
}