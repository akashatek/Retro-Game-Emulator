import { NESEMU } from './NESEMU.js';

// ----------------------------------------------------
// Main Game Entry Point
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    let emu = new NESEMU('game-canvas', 256, 240, 'black');
    await emu.dsk.load("../Assets/NES/Boulder Dash (Europe).nes");
    emu.dsk.dump();
    emu.cpu.reset();
    emu.start();
});