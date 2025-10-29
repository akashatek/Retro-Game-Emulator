import { NESEMU } from './NESEMU.js';

const emu = new NESEMU('game-canvas', 256, 240, 'black');

// ----------------------------------------------------
// Main Game Entry Point
// ----------------------------------------------------
document.getElementById("game-canvas").addEventListener("click", () => {
    emu.clock();
});

document.addEventListener('DOMContentLoaded', async () => {
    emu.dsk.url = "../Assets/NES/Boulder Dash (Europe).nes";
    await emu.powerOn();

    const tile2bppData = emu.ppu.patternTable2bppBitmapTileId(0, 0);
    const tile = emu.ppu.bitmap2bppTileImage(tile2bppData);
    // emu.context.drawImage(tile, 100, 100);
});