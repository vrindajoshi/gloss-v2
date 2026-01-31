const express = require('express');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const DEFAULT_PORT = 3000;

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// API endpoint to scrape an article
app.post('/api/scrape', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    console.log(`Scraping: ${url}`);

    // Call Python scraper
    const jsonOutput = execSync(`python scrape_article.py "${url}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const data = JSON.parse(jsonOutput);

    if (!data.success) {
      return res.status(400).json({ success: false, error: data.error });
    }

    // Format the output
    const formatted = `Title:\n${data.title}\n\nArticle:\n${data.article}`;

    res.json({ success: true, title: data.title, article: data.article, formatted });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server and handle EADDRINUSE by attempting next ports
const desiredPort = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Open your browser and navigate to that URL');
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} in use — trying ${port + 1}...`);
      // try next port
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(desiredPort);
