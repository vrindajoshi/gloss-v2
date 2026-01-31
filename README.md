Article Scraper

This project fetches a news article URL, extracts the title and body text via Python, and writes it to a text file via Node.js.

## Architecture

- **scrape_article.py** – Python script that scrapes a URL and returns JSON with title and article
- **scraper.js** – Node.js script that calls the Python scraper and writes formatted output to a text file
- **output.txt** – The final text file with the article

## Prerequisites

- Python 3.8+
- Node.js 14+
- Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the Node.js script to scrape and save to a file:

```bash
node scraper.js https://www.bbc.com/news/articles/czr4jn4621lo output.txt
```

If no URL is provided, it defaults to the BBC URL above. If no output file is specified, it defaults to `output.txt`.

Check the output:

```bash
cat output.txt
```

## Direct Python Usage

You can also call the Python scraper directly:

```bash
python scrape_article.py https://www.bbc.com/news/articles/czr4jn4621lo
```

It will print JSON to stdout.

## Notes

- The scraper uses heuristics (<h1>, <article>, <main>, or common content classes) and may not extract perfectly for every site.
- For more robust extraction, consider `newspaper3k` or site-specific parsers.
