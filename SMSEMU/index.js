import { SMSEMU } from './SMSEMU.js';

// ----------------------------------------------------
// Main Game Entry Point
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    let EMU = new SMSEMU('game-canvas');
    EMU.DSK.insertRom("../Assets/SMS/Sonic The Hedgehog (USA, Europe).sms");
    await EMU.poweron();
});