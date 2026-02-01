const scrapeBtn = document.getElementById('scrapeBtn');
const urlInput = document.getElementById('urlInput');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorDiv = document.getElementById('error');
const outputSection = document.getElementById('outputSection');
const articleTitle = document.getElementById('articleTitle');
const articleBody = document.getElementById('articleBody');
const downloadBtn = document.getElementById('downloadBtn');
const gradeButtons = document.getElementById('gradeButtons');
const grade3 = document.getElementById('grade3');
const grade9 = document.getElementById('grade9');
const college = document.getElementById('college');

let currentFormatted = null;
let currentUrl = '';
let articleText = '';

function updateUrl(newUrl) {
  currentUrl = newUrl.trim();
  if (urlInput) {
    urlInput.value = currentUrl;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // When popup opens, get the active tab URL and use it
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        updateUrl(tabs[0].url);
      }
    });
  } catch (e) {
    // fallback if chrome.tabs unavailable
    console.warn('Could not read active tab URL:', e);
  }
});

if (scrapeBtn) {
  scrapeBtn.addEventListener('click', () => {
    scrapeArticle();
  });
}

if (grade3) {
  grade3.addEventListener('click', () => {
    translateReadingLevel(articleText, 'Grade 3');
  });
}

if (grade9) {
  grade9.addEventListener('click', () => {
    translateReadingLevel(articleText, 'Grade 9');
  });
}

if (college) {
  college.addEventListener('click', () => {
    translateReadingLevel(articleText, 'College');
  });
}

async function translateReadingLevel(text, level) {
  if (!text) {
    showError('No article text to translate. Scrape an article first.');
    return;
  }

  setLoading(true, '⏳ Translating to ' + level + '...');
  clearError();

  try {
    const encodedText = encodeURIComponent(text);
    const encodedLevel = encodeURIComponent(level);
    
    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 30 second timeout
    
    const resp = await fetch(`http://localhost:3000/translate?text=${encodedText}&level=${encodedLevel}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await resp.json();
    if (!resp.ok || !data.result) {
      const errorMsg = data.error || 'Translation failed';
      return showError(errorMsg + (resp.status === 503 ? ' Try again in a moment.' : ''));
    }

    // Replace article body with translated text
    articleBody.textContent = data.result;
    currentFormatted = data.result;
  } catch (err) {
    if (err.name === 'AbortError') {
      showError('Translation timed out. Make sure test.mjs server is running on port 3001.');
    } else {
      showError(`Translation error: ${err.message}`);
    }
  } finally {
    setLoading(false);
  }
}

async function scrapeArticle() {
  if (!currentUrl) return showError('Please enter a URL');

  setLoading(true, '⏳ Scraping article...');
  clearError();
  hideOutput();

  try {
    const resp = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: window.location.href })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) return showError(data.error || 'Scrape failed');

    currentFormatted = data.formatted;
    articleTitle.textContent = data.title || 'No title';
    articleText = data.formatted;
    articleBody.textContent = data.formatted || '';
    showOutput();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(v, message = '⏳ Loading...') {
  loading.style.display = v ? 'block' : 'none';
  if (loadingText) {
    loadingText.textContent = message;
  }
  scrapeBtn.disabled = v;
  if (gradeButtons) {
    gradeButtons.style.pointerEvents = v ? 'none' : 'auto';
    gradeButtons.style.opacity = v ? '0.5' : '1';
  }
}

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
}

function clearError() {
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

function hideOutput() {
  outputSection.classList.remove('active');
  if (gradeButtons) {
    gradeButtons.classList.add('hidden');
  }
}

function showOutput() {
  outputSection.classList.add('active');
  if (gradeButtons) {
    gradeButtons.classList.remove('hidden');
  }
}