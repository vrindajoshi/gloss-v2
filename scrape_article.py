#!/usr/bin/env python3
"""Simple article scraper that returns JSON.

Usage:
  python scrape_article.py <url>

Outputs JSON to stdout.
"""
import argparse
import json
import requests
from bs4 import BeautifulSoup
import re
import unicodedata


def extract_title(soup):
    # Prefer an <h1>, fall back to <title>
    h1 = soup.find('h1')
    if h1 and h1.get_text(strip=True):
        return h1.get_text(strip=True)
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    return ''


def extract_article_text(soup):
    # Try common containers
    candidates = []
    article_tag = soup.find('article')
    if article_tag:
        candidates.append(article_tag)
    main_tag = soup.find('main')
    if main_tag:
        candidates.append(main_tag)

    # Common classes used by news sites
    class_patterns = [r'content', r'article-body', r'story-body', r'news-article', r'body', r'main-content']
    for pat in class_patterns:
        found = soup.find_all('div', class_=re.compile(pat, re.I))
        candidates.extend(found)

    # Gather paragraphs from best candidate
    def collect_text(tag):
        paras = [p.get_text(separator=' ', strip=True) for p in tag.find_all('p')]
        paras = [p for p in paras if p]
        return '\n\n'.join(paras)

    for cand in candidates:
        text = collect_text(cand)
        if len(text.split()) > 40:  # heuristics: need some content
            return text

    # Fallback: collect from all <p> in body
    body = soup.find('body')
    if body:
        paras = [p.get_text(separator=' ', strip=True) for p in body.find_all('p')]
        paras = [p for p in paras if p]
        text = '\n\n'.join(paras)
        if len(text.split()) > 20:
            return text

    return ''


def fetch_url(url, timeout=15):
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; ArticleScraper/1.0)'
    }
    resp = requests.get(url, headers=headers, timeout=timeout)
    resp.raise_for_status()
    return resp.text


def scrape(url):
    html = fetch_url(url)
    soup = BeautifulSoup(html, 'html.parser')
    title = extract_title(soup)
    article = extract_article_text(soup)
    # Clean up weird characters and control codes (preserve paragraph breaks)
    def clean_text(s):
        if not s:
            return s
        # normalize common unicode forms and replace non-breaking spaces
        s = s.replace('\xa0', ' ')
        s = unicodedata.normalize('NFKC', s)

        # Split into paragraphs (we use double-newline as paragraph separator)
        paras = s.split('\n\n')
        clean_paras = []
        for p in paras:
            # replace replacement character and other control chars with space
            p = p.replace('\ufffd', ' ')
            p = re.sub(r"[\x00-\x1f\x7f-\x9f]", ' ', p)
            # collapse multiple spaces/tabs into single space
            p = re.sub(r'[ \t]+', ' ', p)
            p = p.strip()
            if p:
                clean_paras.append(p)

        return '\n\n'.join(clean_paras)

    title = clean_text(title)
    article = clean_text(article)
    return title, article


def main(argv=None):
    parser = argparse.ArgumentParser(description='Scrape an article and output JSON')
    parser.add_argument('url', help='URL of the article to scrape')
    args = parser.parse_args(argv)

    try:
        title, article = scrape(args.url)
        result = {'success': True, 'title': title, 'article': article}
    except Exception as e:
        result = {'success': False, 'error': str(e)}

    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
