import express from 'express';
import { execSync } from 'child_process';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const DEFAULT_PORT = 3000;

// Initialize Google AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

// Middleware
app.use(express.static(process.cwd()));
app.use(express.json());

// CORS for Chrome extension
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ============================================================
// SCRAPING ENDPOINT
// ============================================================
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

// ============================================================
// TRANSLATION ENDPOINT (Google Gemini AI)
// ============================================================
async function translateReadingLevel(textContent, targetLevel, retries = 2) {
  const prompt = `Rewrite the following text precisely at a ${targetLevel} reading level.\nMaintain the original meaning but adjust vocabulary and sentence complexity.\n\nText: ${textContent}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || (response.output && response.output[0] && response.output[0].content) || '';
  } catch (error) {
    console.error("Error generating content:", error);
    
    // Retry if overloaded and retries remain
    if (error.status === 503 && retries > 0) {
      console.log(`API overloaded, retrying in 2 seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return translateReadingLevel(textContent, targetLevel, retries - 1);
    }
    
    throw error;
  }
}

app.get('/translate', async (req, res) => {
  const text = req.query.text;
  const level = req.query.level || 'grade 6';

  if (!text) {
    return res.status(400).json({ error: 'Missing text query parameter' });
  }

  try {
    const result = await translateReadingLevel(text, level);
    return res.json({ result });
  } catch (err) {
    const errorMessage = err.message || 'Generation error';
    const is503 = err.status === 503 || errorMessage.includes('overloaded');
    
    return res.status(err.status || 500).json({ 
      error: is503 
        ? 'The AI model is currently overloaded. Please try again in a few moments.' 
        : errorMessage 
    });
  }
});

// ============================================================
// SERVER STARTUP
// ============================================================
const desiredPort = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n🚀 Unified server running at http://localhost:${port}`);
    console.log(`   📰 Scraper API: POST /api/scrape`);
    console.log(`   🤖 Translation API: GET /translate\n`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} in use — trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(desiredPort);
