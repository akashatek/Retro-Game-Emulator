import { NESEMU } from './nesemu.js';

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
const romInput = document.getElementById('rom-input');
const statusElement = document.getElementById('status');

const nesEmu = new NESEMU();

function setStatus(message, isError = false) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? '#ff6b6b' : '#a0a0a0';
}

romInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus(`Loading "${file.name}"...`);
    const reader = new FileReader();
    reader.onload = (event) => {
        const romData = new Uint8Array(event.target.result);
        if (nesEmu.loadRom(romData)) {
            setStatus(`ROM "${file.name}" loaded successfully.`);
            // TODO: Start emulation loop after successful load
        } else {
            setStatus('Invalid NES ROM or unsupported mapper.', true);
        }
    };
    reader.onerror = () => setStatus('Error loading file.', true);
    reader.readAsArrayBuffer(file);
});

// Initial canvas setup
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
setStatus('Ready to load an NES ROM.');
