// Inject Gloss UI on BBC pages
(function() {
  'use strict';

  const PANEL_WIDTH = 480;
  let isPanelOpen = false;
  let iframe = null;
  let minimizedButton = null;

  // Inject CSS for gloss-active class
  function injectGlossStyles() {
    if (document.getElementById('gloss-styles')) return;

    const style = document.createElement('style');
    style.id = 'gloss-styles';
    style.textContent = `
      body.gloss-active {
        padding-right: ${PANEL_WIDTH}px !important;
        transition: padding-right 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Function to adjust page content when panel opens/closes
  function shiftPageContent(open) {
    const body = document.body;
    
    // Inject styles if not already present
    injectGlossStyles();
    
    if (open) {
      // Add class to body - this applies padding-right equal to panel width
      body.classList.add('gloss-active');
    } else {
      // Remove class to restore original layout
      body.classList.remove('gloss-active');
    }
  }

  // Create minimized button - using actual Gloss logo
  function createMinimizedButton() {
    if (minimizedButton) return;

    const logoUrl = chrome.runtime.getURL('icons/GlossLogo128.png');

    minimizedButton = document.createElement('div');
    minimizedButton.id = 'gloss-minimized-button';
    minimizedButton.innerHTML = `
      <button
        style="
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 2147483647;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: white;
          background-image: url('${logoUrl}');
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: pixelated;
        "
        aria-label="Open Gloss panel"
      >
      </button>
    `;

    // Add hover effect
    const button = minimizedButton.querySelector('button');
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    // Open panel on click
    button.addEventListener('click', openPanel);

    if (document.body) {
      document.body.appendChild(minimizedButton);
    } else {
      document.documentElement.appendChild(minimizedButton);
    }
  }

  // Open the panel
  function openPanel() {
    if (isPanelOpen || iframe) return;

    isPanelOpen = true;

    // Hide minimized button
    if (minimizedButton) {
      minimizedButton.style.display = 'none';
    }

    // Create the iframe
    iframe = document.createElement('iframe');
    iframe.id = 'gloss-iframe';
    iframe.src = chrome.runtime.getURL(
      'dist/index.html?mode=panel&src=' + encodeURIComponent(window.location.href)
    );
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: ${PANEL_WIDTH}px;
      height: 100vh;
      z-index: 2147483646;
      border: none;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      border-radius: 16px 0 0 16px;
      background: white;
    `;

    // Append to document
    if (document.body) {
      document.body.appendChild(iframe);
    } else {
      document.documentElement.appendChild(iframe);
    }

    // Shift page content
    shiftPageContent(true);
  }

  // Close the panel
  function closePanel() {
    if (!isPanelOpen || !iframe) return;

    isPanelOpen = false;

    // Remove iframe
    if (iframe) {
      iframe.remove();
      iframe = null;
    }

    // Show minimized button
    if (minimizedButton) {
      minimizedButton.style.display = 'block';
    }

    // Restore page content
    shiftPageContent(false);
  }

  // Listen for messages from iframe
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GLOSS_CLOSE') {
      closePanel();
    }
    if (event.data && event.data.type === 'GLOSS_OPEN') {
      openPanel();
    }
  });

  // Initialize: create minimized button
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMinimizedButton);
  } else {
    createMinimizedButton();
  }
})();
