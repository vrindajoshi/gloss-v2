const scrapeBtn = document.getElementById('scrapeBtn');
const urlInput = document.getElementById('urlInput');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const outputSection = document.getElementById('outputSection');
const articleTitle = document.getElementById('articleTitle');
const articleBody = document.getElementById('articleBody');
const downloadBtn = document.getElementById('downloadBtn');

let currentFormatted = null;

document.addEventListener('DOMContentLoaded', () => {
  // When popup opens, get the active tab URL and use it
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].url) {
        urlInput.value = tabs[0].url;
        // automatically scrape the current tab
        scrapeArticle();
      }
    });
  } catch (e) {
    // fallback if chrome.tabs unavailable
    console.warn('Could not read active tab URL:', e);
  }
});

scrapeBtn.addEventListener('click', () => {
  scrapeArticle();
});

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') scrapeArticle();
});

async function scrapeArticle() {
  const url = urlInput.value.trim();
  if (!url) return showError('Please enter a URL');

  setLoading(true);
  clearError();
  hideOutput();

  try {
    const resp = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) return showError(data.error || 'Scrape failed');

    currentFormatted = data.formatted;
    articleTitle.textContent = data.title || 'No title';
    articleBody.textContent = data.formatted || '';
    showOutput();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(v) {
  loading.style.display = v ? 'block' : 'none';
  scrapeBtn.disabled = v;
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
}

function showOutput() {
  outputSection.classList.add('active');
}

downloadBtn.addEventListener('click', () => {
  if (!currentFormatted) return;
  const blob = new Blob([currentFormatted], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `article_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
