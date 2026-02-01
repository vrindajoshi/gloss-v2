let isScraped = false; 
let auraTimer;

// Create and inject the aura element immediately (invisible by default)
const aura = document.createElement('div');
aura.id = 'vignette-aura';
document.documentElement.appendChild(aura);

// --- WAIT FOR SIGNAL FROM POPUP ---
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "START_TRACKING") {
        isScraped = true; 
        resetAura(); // Trigger the first 5s countdown
        console.log("Aura tracking: ACTIVE");
    }
});

function resetAura() {
    // Only reset if the "lock" is open
    if (!isScraped) return; 

    aura.classList.remove('vignette-active');
    clearTimeout(auraTimer);
    
    auraTimer = setTimeout(() => {
        aura.classList.add('vignette-active');
    }, 5000); // 5 seconds
}

// Watch for mouse movement to reset the timer
window.addEventListener('mousemove', resetAura);
