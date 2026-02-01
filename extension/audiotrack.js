// CONFIGURATION
const IDLE_TIME = 5000; // 5 seconds (5000ms) - matches vignette timing

let lastMouseX = 0;
let lastMouseY = 0;
let idleTimer;
let audio = null;
let isPlaying = false;
let focusModeEnabled = false;
let isInitialized = false;

/**
 * Triggers the bubbles audio file
 */
function playBubbles() {
    // Only play if focus mode is enabled
    if (!focusModeEnabled) {
        console.log("🔇 Audio not playing: focus mode not enabled");
        return;
    }
    
    if (isPlaying) {
        console.log("🔇 Audio not playing: already playing");
        return;
    }

    console.log("⚠️ INACTIVITY DETECTED! Playing bubbles sound...");
    
    // Get the audio file URL from the extension
    const soundURL = chrome.runtime.getURL('assets/alert.mp3');
    console.log("🔊 Audio URL:", soundURL);
    
    // Create and play audio
    audio = new Audio(soundURL);
    isPlaying = true;
    
    audio.play().then(() => {
        console.log("✅ Bubbles sound playing successfully");
    }).catch(err => {
        console.error("❌ Failed to play sound:", err);
        isPlaying = false;
    });
    
    // Reset when audio ends
    audio.onended = () => {
        console.log("🔇 Bubbles sound finished");
        isPlaying = false;
        audio = null;
    };
}

/**
 * Stops the bubbles audio
 */
function stopBubbles() {
    if (audio && isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        audio = null;
    }
}

/**
 * Resets the countdown timer
 */
function resetTimer() {
    stopBubbles();
    clearTimeout(idleTimer);
    
    // Only start timer if focus mode is enabled
    if (focusModeEnabled) {
        idleTimer = setTimeout(() => {
            console.log("⏰ Idle timer expired after", IDLE_TIME, "ms");
            playBubbles();
        }, IDLE_TIME);
        console.log("🔄 Idle timer reset - will trigger in", IDLE_TIME, "ms");
    }
}

/**
 * Track mouse movement
 */
function handleMouseMove(event) {
    const currentX = event.clientX;
    const currentY = event.clientY;
    
    // Check if mouse actually moved
    if (currentX !== lastMouseX || currentY !== lastMouseY) {
        lastMouseX = currentX;
        lastMouseY = currentY;
        resetTimer();
    }
}

/**
 * Enable focus mode and start audio tracking
 */
function enableFocusMode() {
    console.log("🎯 Focus mode enabled - Audio tracking active");
    focusModeEnabled = true;
    resetTimer();
}

/**
 * Disable focus mode and stop audio tracking
 */
function disableFocusMode() {
    console.log("🎯 Focus mode disabled - Audio tracking stopped");
    focusModeEnabled = false;
    clearTimeout(idleTimer);
    stopBubbles();
}

/**
 * Initialize event listeners
 */
function init() {
    if (isInitialized) return;
    
    // Capture initial position (will be set on first mouse move)
    lastMouseX = 0;
    lastMouseY = 0;
    
    // Listen for mouse movement
    document.addEventListener('mousemove', handleMouseMove);
    
    // Optional: Also track other user interactions
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('click', resetTimer);
    document.addEventListener('scroll', resetTimer);
    
    // Listen for focus mode toggle messages (from iframe via postMessage)
    window.addEventListener('message', (event) => {
        if (event.data.type === 'FOCUS_MODE_TOGGLE') {
            if (event.data.enabled) {
                enableFocusMode();
            } else {
                disableFocusMode();
            }
        }
    });
    
    // Listen for focus mode toggle via chrome.runtime (from popup/background)
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // Handle both message formats: START_TRACKING/STOP_TRACKING and FOCUS_MODE_TOGGLE
        if (message.action === 'START_TRACKING' || (message.type === 'FOCUS_MODE_TOGGLE' && message.enabled)) {
            enableFocusMode();
        } else if (message.action === 'STOP_TRACKING' || (message.type === 'FOCUS_MODE_TOGGLE' && !message.enabled)) {
            disableFocusMode();
        }
    });
    
    // Alternative: Listen for custom events (if your code uses CustomEvent)
    document.addEventListener('focusModeEnabled', enableFocusMode);
    document.addEventListener('focusModeDisabled', disableFocusMode);
    
    isInitialized = true;
    console.log("🎵 Audio tracker initialized (waiting for focus mode)");
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expose functions globally so other scripts can call them
window.audioTracker = {
    enableFocusMode,
    disableFocusMode,
    resetTimer
};
