const { exec, execSync } = require('child_process');
const path = require('path');
// Initialize the player
const player = require('play-sound')();

// CONFIGURATION
const IDLE_TIME = 10000; // 10 seconds (10000ms)
const SOUND_PATH = path.join(__dirname, 'assets', 'alert.mp3');

let lastPos = "";
let idleTimer;
let audioProcess = null;


function getMousePos() {
    try {
        const cmd = 'powershell -command "[Reflection.Assembly]::LoadWithPartialName(\'System.Windows.Forms\') | Out-Null; [System.Windows.Forms.Cursor]::Position"';
        return execSync(cmd).toString().trim();
    } catch (e) {
        return "";
    }
}

/**
 * Triggers the audio file
 */
function playAlert() {
    if (audioProcess) return;

    console.log("⚠️ INACTIVITY DETECTED! Playing sound...");
    
    // Use backticks ` here, NOT single quotes '
    audioProcess = exec(`cmdmp3 "${SOUND_PATH}"`, (err) => {
        audioProcess = null;
    });
}

function stopAlert() {
    if (audioProcess) {
        // Kills the specific background task by its Process ID (PID)
        exec(`taskkill /F /T /PID ${audioProcess.pid}`, () => {
            audioProcess = null;
        });
    }
}

/**
 * Resets the countdown timer
 */
function resetTimer() {
    stopAlert();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(playAlert, IDLE_TIME);
}

// 1. Capture the starting position
lastPos = getMousePos();

// 2. Start the idle timer immediately
resetTimer();

// 3. Main loop: Check for movement every 200ms
setInterval(() => {
    const currentPos = getMousePos();
    
    // If the string (X=..., Y=...) has changed, the mouse moved
    if (currentPos !== lastPos) {
        lastPos = currentPos;
        resetTimer();
    }
}, 200);