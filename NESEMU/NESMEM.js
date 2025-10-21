


export class NESMEM {
    constructor(size = 8 * 1024) {
        this.datas = new Uint8Array(size);
        this.size = size;
    }

    readByte(addr) {
        return this.datas[addr];
    }

    writeByte(addr, value) {
        this.datas[addr] = value;
    }

    // New Function: Read a 16-bit word in Little-Endian format
    // $addr contains the Low byte, $addr + 1 contains the High byte
    readWordLittleEndian(addr) {
        let lo = this.datas[addr];
        let hi = this.datas[addr + 1];
        // Combine (hi << 8) | lo
        return (hi << 8) | lo;
    }

    // New Function: Read a 16-bit word in Big-Endian format
    // $addr contains the High byte, $addr + 1 contains the Low byte
    readWordBigEndian(addr) {
        let hi = this.datas[addr];
        let lo = this.datas[addr+1];
        // Combine (hi << 8) | lo
        return (hi << 8) | lo;
    }
    
    reset(bytes) {
        if (!(bytes instanceof Uint8Array)) {
            console.error("Invalid input: must be a Uint8Array.");
            return false;
        }
        
        this.datas = bytes;
        this.size = bytes.length;
        return true;
    }

    async load(url) {
        try {
            const response = await fetch(url);
             if (!response.ok) {
                // Throw an error if the HTTP status is not successful (e.g., 404)
                throw new Error(`HTTP error! Status: ${response.status} when fetching ${url}`);
            }

            // Get the response body as a raw ArrayBuffer
            const buffer = await response.arrayBuffer();

            // Convert ArrayBuffer to Uint8Array
            const bytes = new Uint8Array(buffer);

            // Re-use existing loadRom method to handle assignment and logging
            return this.reset(bytes);
        } catch (error) {
            console.error(`Error loading file ${url}: ${error}`);
            return null;
        }
    }

    hexdump() {
        const bytesPerLine = 16;
        let str = "";
        
        for (let addr = 0; addr < this.size; addr++) {
            // Start of a new line: print the address
            if (addr % bytesPerLine === 0) {
                // If it's not the very first line, add a newline character
                if (addr !== 0) {
                    str += "\n";
                }
                // Add the 4-digit hexadecimal address (e.g., 0000)
                str += addr.toString(16).padStart(8, '0').toUpperCase() + " : ";
            }

            // Add the 2-digit hexadecimal byte value (e.g., C3)
            // Note: toString(16) uses base 16 (hex)
            str += this.datas[addr].toString(16).padStart(2, '0').toUpperCase() + " ";
        }

        // Output the final string to the console
        if (this.size > 0) {
            console.log(str);
        } else {
            console.log("No data loaded to dump.");
        }
    }

    ascii(offset, length) {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(this.datas.slice(offset, offset + length));
    }

    compare(offset, length, bytes) {
        for(let i=0; i < length; i++) {
            if (this.datas[offset + i] != bytes[i]) {
                return false;
            }
        }
        return true;
    }
}
