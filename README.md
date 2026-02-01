# Gloss — A Softer Way To Read

For some of us, reading feels effortless. It’s so natural we don’t even remember learning how to do it. We read to understand, to unwind, to get lost in a story, or to feel a sense of comfort when things are hard. But unfortunately, that isn’t everyone’s reality.
For many people, reading feels like a constant struggle, like swimming against a current that never lets up. Every sentence takes effort, and every page feels exhausting.

In Canada, this struggle is more common than we think. According to Statistics Canada, 49% of adults read below high-school literacy levels. Many live with learning differences like dyslexia or ADHD, while newcomers, Indigenous peoples, and low-income communities face added barriers that make reading even more difficult. These challenges are often invisible, but they shape these experiences in powerful ways.

Gloss was created with these realities in mind, and with a vision of changing these statistics for the better. It’s not about fixing readers or asking them to adapt to systems that weren’t built for them. It’s about adjusting the reading experience itself, making space for different needs, paces, and ways of understanding. Our goal is to help make reading feel possible again, because everyone deserves access to language, knowledge, and confidence.

---

## ✨ Features

- Chrome extension for scraping articles
- React frontend for simplified reading
- Article extraction with title + content
- Accessibility-focused, Warm and Cozy UI

---

## ⚙️ Prerequisites

### General
- Node.js v18+ (recommended)
- npm v9+
- Python 3.8+

### Python Dependencies
Install required Python packages:
```bash
pip install -r requirements.txt
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <repo-folder>
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server (hot reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

The production build will be output to:
```text
frontend/dist
```

Preview the production build:
```bash
npm run preview
```

---

### 3. Backend (Python Scraper)

Run the Python scraper directly:
```bash
python scrape_article.py
```

Ensure Python is installed and available in your system PATH.

---

### 4. Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
