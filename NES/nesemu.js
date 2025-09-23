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
        this.nesCpu = new NESCPU(this.nesBus);
        this.nesPpu = new NESPPU(this.nesBus, display);
        // NESBUS needs to be initialized last so it can have access to the CPU and PPU.
        this.nesBus = new NESBUS(this.nesMem, this.nesCpu, this.nesPpu);
        // Correct the dependencies for nesCpu and nesPpu after nesBus is created
        this.nesCpu.nesBus = this.nesBus;
        this.nesPpu.nesBus = this.nesBus;

        // Emulator state
        this._isRunning = false;
        this._lastFrameTime = 0;
        // The NES CPU clock speed is 1.79MHz.
        // We'll calculate the number of cycles to run per frame.
        this.cpuCyclesPerFrame = 1789773 / 60; // NTSC at 60 FPS

        console.log("NESEMU initialized.");
    }

    powerOn(file) {
        console.log("NESEMU is powering on");
        this.nesDsk.powerOn(file);
        this._isRunning = true;
        this._lastFrameTime = performance.now();
        // Start the game loop
        this.update(this._lastFrameTime);
    }

    powerOff() {
        console.log("NESEMU is powering off");
        this._isRunning = false;
    }

    reset() {
        console.log("NESEMU is resetting.");
        // TODO: Implement reset logic
    }

    /**
     * The main update method called by the game loop.
     * @param {number} timestamp The current time in milliseconds.
     */
    update(timestamp) {
        if (!this._isRunning) return;

        // Calculate delta time
        const dt = timestamp - this._lastFrameTime;
        this._lastFrameTime = timestamp;

        // Calculate the number of cycles to run this frame.
        // This is a simple approximation. A more accurate emulator would
        // use a cycle-by-cycle approach.
        let cyclesToRun = Math.floor(dt * (this.cpuCyclesPerFrame / (1000 / 60)));

        for (let i = 0; i < cyclesToRun; i++) {
            this.nesBus.step();
        }

        requestAnimationFrame(this.update.bind(this));
    }
}
