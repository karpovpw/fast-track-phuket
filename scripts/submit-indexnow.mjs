import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';
const HOST = 'fast-track-phuket.com';
const INDEXNOW_KEY = '835f0b6a3e5c42f0b2d8e7a985c4d301';
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'dist', 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  throw new Error(`Build the site before submitting IndexNow URLs. Missing ${sitemapPath}`);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith(`${BASE_URL}/`));

if (urls.length === 0) {
  throw new Error('No fast-track-phuket.com URLs found in dist/sitemap.xml');
}

const response = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }),
});

if (!response.ok && response.status !== 202) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${body}`);
}

console.log(`Submitted ${urls.length} URLs to IndexNow. HTTP ${response.status}.`);
