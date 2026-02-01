// ===========================
// VIGNETTE EFFECT SETUP
// ===========================

let aura = null;
let auraTimer = null;
let isScraped = false; // Focus mode state
let isTextLoaded = false; // Track if simplified text is loaded

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
    // Only activate if BOTH focus mode is enabled AND text is loaded
    if (!isScraped || !isTextLoaded) return;
    
    clearTimeout(auraTimer);
    
    // Hide immediately (activity)
    if (aura) {
        aura.style.opacity = '0';
        aura.classList.remove('vignette-active');
    }
    
    // Show after 5 seconds of idle
    auraTimer = setTimeout(() => {
        if (aura && isScraped && isTextLoaded) {
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
// FOCUS MODE & TEXT LOADING
// ===========================

// Listen for messages from your extension popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle focus mode toggle (from FocusMode.tsx - uses "action" field)
    if (message.action === 'START_TRACKING' || (message.type === 'FOCUS_MODE_TOGGLE' && message.enabled)) {
        isScraped = true;
        console.log('🎯 Focus mode enabled');
        createAura();
        
        // Enable audio tracking - wait a bit for audioTracker to be ready
        const enableAudio = () => {
            if (window.audioTracker) {
                window.audioTracker.enableFocusMode();
            } else {
                // Retry after a short delay if not ready yet
                setTimeout(enableAudio, 100);
            }
        };
        enableAudio();
        
        // Only start vignette timer if text is already loaded
        if (isTextLoaded) {
            resetAura();
        }
    } else if (message.action === 'STOP_TRACKING' || (message.type === 'FOCUS_MODE_TOGGLE' && !message.enabled)) {
        isScraped = false;
        console.log('🎯 Focus mode disabled');
        
        // Disable audio tracking
        if (window.audioTracker) {
            window.audioTracker.disableFocusMode();
        }
        
        // Hide vignette and stop timer
        if (aura) {
            aura.style.opacity = '0';
            aura.classList.remove('vignette-active');
        }
        clearTimeout(auraTimer);
    }
    
    // Handle text loaded event
    if (message.type === 'TEXT_LOADED') {
        console.log('📄 Simplified text loaded');
        isTextLoaded = true;
        
        // Start vignette timer if focus mode is already enabled
        if (isScraped) {
            resetAura();
        }
    }
    
    // Handle text unloaded event
    if (message.type === 'TEXT_UNLOADED') {
        console.log('📄 Simplified text unloaded');
        isTextLoaded = false;
        
        // Stop vignette
        if (aura) {
            aura.style.opacity = '0';
            aura.classList.remove('vignette-active');
        }
        clearTimeout(auraTimer);
    }
});

// Listen for messages from iframe (React app sends postMessage)
window.addEventListener('message', (event) => {
    // Handle focus mode toggle from iframe
    if (event.data.type === 'FOCUS_MODE_TOGGLE') {
        isScraped = event.data.enabled;
        
        if (isScraped) {
            console.log('🎯 Focus mode enabled (from iframe)');
            createAura();
            
            if (window.audioTracker) {
                window.audioTracker.enableFocusMode();
            }
            
            if (isTextLoaded) {
                resetAura();
            }
        } else {
            console.log('🎯 Focus mode disabled (from iframe)');
            
            if (window.audioTracker) {
                window.audioTracker.disableFocusMode();
            }
            
            if (aura) {
                aura.style.opacity = '0';
                aura.classList.remove('vignette-active');
            }
            clearTimeout(auraTimer);
        }
    }
    
    // Handle text loaded from iframe
    if (event.data.type === 'TEXT_LOADED') {
        console.log('📄 Simplified text loaded (from iframe)');
        isTextLoaded = true;
        
        if (isScraped) {
            resetAura();
        }
    }
    
    // Handle text unloaded from iframe
    if (event.data.type === 'TEXT_UNLOADED') {
        console.log('📄 Simplified text unloaded (from iframe)');
        isTextLoaded = false;
        
        if (aura) {
            aura.style.opacity = '0';
            aura.classList.remove('vignette-active');
        }
        clearTimeout(auraTimer);
    }
});

// ===========================
// TESTING: Auto-enable for demo
// ===========================

// Remove this section in production - it's just for testing
setTimeout(() => {
    isScraped = true; // Enable focus mode for testing
    isTextLoaded = true; // Simulate text being loaded for testing
    console.log('🧪 Test mode: Focus mode auto-enabled');
    
    // Enable audio for testing - wait for audioTracker to be ready
    const enableAudio = () => {
        if (window.audioTracker) {
            window.audioTracker.enableFocusMode();
            console.log('🧪 Test mode: Audio tracker enabled');
        } else {
            // Retry after a short delay if not ready yet
            setTimeout(enableAudio, 100);
        }
    };
    enableAudio();
    
    resetAura(); // Start the idle timer
}, 1000);
