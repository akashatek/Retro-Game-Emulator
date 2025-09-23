import NESEMU from './nesemu.js';

window.onload = () => {
    // Get UI elements
    const powerButton = document.getElementById('power-button');
    const resetButton = document.getElementById('reset-button');
    const romFile = document.getElementById('rom-input');
    const display = document.getElementById('screen');

    let selectedFile = null;
    const nesEmu = new NESEMU(display);

    // Event Listeners
    powerButton.addEventListener('click', (e) => {
        // Only allow powering on if a file has been selected
        if (selectedFile) {
            const isPoweredOn = e.target.classList.toggle('w3-green');
            e.target.classList.toggle('w3-red');
            nesEmu.powerOn(selectedFile);
        } else {
            console.log("Please select a ROM file first.");
        }
    });

    resetButton.addEventListener('click', (e) => {
        // Change the button color to red immediately
        e.target.classList.remove('w3-green');
        e.target.classList.add('w3-red');
        
        // Perform the reset
        nesEmu.reset();
        console.log("Reset button clicked. Emulator state reset.");

        // After a short delay, change the color back to green
        setTimeout(() => {
            e.target.classList.remove('w3-red');
            e.target.classList.add('w3-green');
        }, 100);
    });

    romFile.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        console.log(`ROM file selected: ${selectedFile.name}`);
    });

    console.log("NES Emulator UI loaded.");
};
