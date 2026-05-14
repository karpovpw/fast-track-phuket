import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const localeDir = path.join(projectRoot, 'src', 'locales');

const languages = [
  { code: 'ru', htmlLang: 'ru', dir: 'ltr', ogLocale: 'ru_RU' },
  { code: 'zh', htmlLang: 'zh', dir: 'ltr', ogLocale: 'zh_CN' },
  { code: 'hi', htmlLang: 'hi', dir: 'ltr', ogLocale: 'hi_IN' },
  { code: 'he', htmlLang: 'he', dir: 'rtl', ogLocale: 'he_IL' },
  { code: 'ar', htmlLang: 'ar', dir: 'rtl', ogLocale: 'ar_AR' },
  { code: 'es', htmlLang: 'es', dir: 'ltr', ogLocale: 'es_ES' },
  { code: 'fr', htmlLang: 'fr', dir: 'ltr', ogLocale: 'fr_FR' },
  { code: 'de', htmlLang: 'de', dir: 'ltr', ogLocale: 'de_DE' },
  { code: 'it', htmlLang: 'it', dir: 'ltr', ogLocale: 'it_IT' },
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const replaceTag = (html, pattern, replacement) => html.replace(pattern, replacement);

const appHtmlPath = path.join(distDir, 'index.html');
const appHtml = fs.readFileSync(appHtmlPath, 'utf8');

for (const language of languages) {
  const locale = JSON.parse(fs.readFileSync(path.join(localeDir, `${language.code}.json`), 'utf8'));
  const url = `${BASE_URL}/${language.code}/`;
  const title = `${locale['hero.title']} | Phuket Airport Fast Track`;
  const description = locale['hero.subtitle'];

  let localizedHtml = appHtml;

  localizedHtml = replaceTag(
    localizedHtml,
    /<html\b[^>]*>/,
    `<html lang="${language.htmlLang}" dir="${language.dir}">`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${escapeHtml(title)}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${language.ogLocale}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  localizedHtml = replaceTag(
    localizedHtml,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  const outputDir = path.join(distDir, language.code);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), localizedHtml);
}

console.log(`Generated ${languages.length} localized app pages from the built React shell`);
