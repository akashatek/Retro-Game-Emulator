import NESMEM from './nesmem.js';
import NESBUS from './nesbus.js';
import NESCPU from './nescpu.js';
import NESPPU from './nesppu.js';
import NESDSK from './nesdsk.js';

export default class NESEMU {
    constructor(display) {
        // NES Components
        this.nesDsk = new NESDSK(this);
        this.nesMem = new NESMEM();
        this.nesBus = new NESBUS(this.nesMem);
        this.nesCpu = new NESCPU(this.nesBus);
        this.nesPpu = new NESPPU(this.nesBus, display);

        console.log("NESEMU initialized.");
    }

    power(state, file) {
        console.log("NESEMU is powering " + (state ? "on" : "off"));
        if (state) {
            // Power on logic is now initiated from here
            this.nesDsk.powerOn(file);
        } else {
            // TODO: Implement power off logic
        }
    }

    reset() {
        console.log("NESEMU is resetting.");
        // TODO: Implement reset logic
    }
}
