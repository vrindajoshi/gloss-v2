const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function scrapeAndSave(url, outputFile = 'output.txt') {
  try {
    console.log(`Scraping: ${url}`);

    // Call Python scraper and capture JSON output
    const jsonOutput = execSync(`python scrape_article.py "${url}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const data = JSON.parse(jsonOutput);

    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    // Format the output
    const formatted = `Title:\n${data.title}\n\nArticle:\n${data.article}`;

    // Write to file
    fs.writeFileSync(outputFile, formatted, 'utf-8');
    console.log(`✓ Article saved to: ${outputFile}`);

    return { success: true, file: outputFile };
  } catch (err) {
    console.error(`✗ Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Example usage
const url = process.argv[2] || 'https://www.bbc.com/news/articles/czr4jn4621lo';
const outputFile = process.argv[3] || 'output.txt';

scrapeAndSave(url, outputFile).then(result => {
  if (!result.success) {
    process.exit(1);
  }
});
