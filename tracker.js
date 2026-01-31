const { execSync } = require('child_process');
const path = require('path');
// Initialize the player
const player = require('play-sound')();

// CONFIGURATION
const IDLE_TIME = 5000; // 5 seconds (5000ms)
const SOUND_PATH = path.join(__dirname, 'assets', 'alert.mp3');

let lastPos = "";
let idleTimer;

console.log("✅ Script Initialized!");
console.log("👀 Monitoring mousepad movement...");
console.log(`🔊 Alert sound linked to: ${SOUND_PATH}`);

/**
 * Uses PowerShell to get the global X,Y coordinates of the mouse
 */
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
    console.log("⚠️ INACTIVITY DETECTED! Playing sound...");
    player.play(SOUND_PATH, (err) => {
        if (err) {
            console.error("❌ Sound Error: Ensure the file exists and a player (like Windows Media Player) is available.");
            console.error("Error details:", err);
        }
    });
}

/**
 * Resets the countdown timer
 */
function resetTimer() {
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