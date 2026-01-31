const grade3Btn = document.getElementById('grade3');
const grade6Btn = document.getElementById('grade6');
const grade9Btn = document.getElementById('grade9');
const articleBody = document.getElementById('articleBody');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

function setLoading(v) {
  if (loading) loading.style.display = v ? 'block' : 'none';
  grade3Btn.disabled = grade6Btn.disabled = grade9Btn.disabled = v;
}

function showError(msg) {
  if (!errorDiv) return;
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
}

function clearError() {
  if (!errorDiv) return;
  errorDiv.textContent = '';
  errorDiv.style.display = 'none';
}

async function translate(level) {
  clearError();
  const text = articleBody ? articleBody.textContent.trim() : '';
  if (!text) return showError('No article text available. Scrape first.');

  setLoading(true);
  try {
    const encoded = encodeURIComponent(text);
    const resp = await fetch(`http://localhost:3001/translate?text=${encoded}&level=${encodeURIComponent(level)}`);
    const data = await resp.json();
    if (!resp.ok) return showError(data.error || 'Translation failed');
    articleBody.textContent = data.result || '';
  } catch (err) {
    showError(err.message || 'Request failed');
  } finally {
    setLoading(false);
  }
}

grade3Btn.addEventListener('click', () => translate('grade 3'));
grade6Btn.addEventListener('click', () => translate('grade 6'));
grade9Btn.addEventListener('click', () => translate('grade 9'));
