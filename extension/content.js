// ===========================
// VIGNETTE EFFECT SETUP
// ===========================

let aura = null;
let auraTimer = null;
let isScraped = false; // Set this based on your focus mode state

// Create the vignette overlay element
function createAura() {
    if (aura) return; // Don't create if it already exists
    
    aura = document.createElement('div');
    aura.id = 'focus-vignette';
    
    // Critical styles for visibility
    aura.style.position = 'fixed';
    aura.style.top = '0';
    aura.style.left = '0';
    aura.style.width = '100vw';
    aura.style.height = '100vh';
    aura.style.pointerEvents = 'none'; // Don't block clicks
    aura.style.zIndex = '999999'; // Appear on top
    aura.style.opacity = '0'; // Start hidden
    aura.style.transition = 'opacity 600ms ease-in-out';
    
    // The vignette gradient - darkens edges, keeps center clear
    aura.style.background = 'radial-gradient(ellipse 150% 150% at center, transparent 0%, transparent 28%, rgba(0, 0, 0, 0.85) 100%)';
    
    document.body.appendChild(aura);
    console.log('✨ Vignette overlay created');
}

// Reset the idle timer and hide vignette
function resetAura() {
    if (!isScraped) return;
    
    clearTimeout(auraTimer);
    
    // Hide immediately (activity)
    if (aura) {
        aura.style.opacity = '0';
        aura.classList.remove('vignette-active');
    }
    
    // Show after 5 seconds of idle
    auraTimer = setTimeout(() => {
        if (aura) {
            aura.style.opacity = '1';
            aura.classList.add('vignette-active');
            console.log('🎭 Aura ON (idle >5s)');
        }
    }, 5000);
}

// ===========================
// EVENT LISTENERS
// ===========================

// Initialize vignette when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAura);
} else {
    createAura();
}

// Track mouse movement to reset idle timer
window.addEventListener('mousemove', (e) => {
    resetAura();
});

// You may also want to track other activity:
window.addEventListener('keydown', resetAura);
window.addEventListener('click', resetAura);
window.addEventListener('scroll', resetAura);

// ===========================
// EXAMPLE: Listen for focus mode state
// ===========================

// Listen for messages from your extension popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FOCUS_MODE_TOGGLE') {
        isScraped = message.enabled;
        
        if (isScraped) {
            console.log('🎯 Focus mode enabled');
            createAura();
            resetAura(); // Start the idle timer
        } else {
            console.log('🎯 Focus mode disabled');
            if (aura) {
                aura.style.opacity = '0';
                aura.classList.remove('vignette-active');
            }
            clearTimeout(auraTimer);
        }
    }
});

// ===========================
// TESTING: Auto-enable for demo
// ===========================

// Remove this section in production - it's just for testing
setTimeout(() => {
    isScraped = true; // Enable focus mode for testing
    console.log('🧪 Test mode: Focus mode auto-enabled');
    resetAura(); // Start the idle timer
}, 1000);
