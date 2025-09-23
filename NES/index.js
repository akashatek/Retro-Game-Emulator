import NESEMU from './nesemu.js';

window.onload = () => {
    // Get UI elements
    const powerButton = document.getElementById('power-button');
    const resetButton = document.getElementById('reset-button');
    const romFileSelector = document.getElementById('rom-input'); // Corrected ID

    let selectedFile = null;
    const nesEmu = new NESEMU();

    // Event Listeners
    powerButton.addEventListener('click', (e) => {
        // Only allow powering on if a file has been selected
        if (selectedFile) {
            const isPoweredOn = e.target.classList.toggle('w3-green');
            e.target.classList.toggle('w3-red');
            nesEmu.power(isPoweredOn, selectedFile);
        } else {
            console.log("Please select a ROM file first.");
        }
    });

    resetButton.addEventListener('click', (e) => {
        nesEmu.reset();
        e.target.classList.add('w3-green');
        e.target.classList.remove('w3-red');
        setTimeout(() => {
            e.target.classList.remove('w3-green');
            e.target.classList.add('w3-red');
        }, 100);
    });

    romFileSelector.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        console.log(`ROM file selected: ${selectedFile.name}`);
    });

    console.log("NES Emulator UI loaded.");
};
