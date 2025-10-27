import { NESEMU } from './NESEMU.js';

const emu = new NESEMU('game-canvas', 256, 240, 'black');

// ----------------------------------------------------
// Main Game Entry Point
// ----------------------------------------------------
document.getElementById("game-canvas").addEventListener("click", () => {
    emu.clock();
});

document.addEventListener('DOMContentLoaded', async () => {
    await emu.dsk.load("../Assets/NES/Boulder Dash (Europe).nes");
    emu.cpu.reset();
});