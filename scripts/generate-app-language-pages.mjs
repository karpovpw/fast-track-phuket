import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const localeDir = path.join(projectRoot, 'src', 'locales');

const languages = [
  { code: 'en', htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US' },
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
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const splitList = (value) => String(value || '').split('|').filter(Boolean);

const replaceTag = (html, pattern, replacement) => html.replace(pattern, replacement);

const appHtmlPath = path.join(distDir, 'index.html');
const appHtml = fs.readFileSync(appHtmlPath, 'utf8');

const languageUrl = (code) => code === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${code}/`;

const renderStructuredData = (language, t, url) => {
  const faqItems = [1, 2, 3, 4, 5, 6].map((index) => ({
    '@type': 'Question',
    name: t[`faq.${index}.q`],
    acceptedAnswer: {
      '@type': 'Answer',
      text: t[`faq.${index}.a`],
    },
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t['hero.title'],
        description: t['hero.subtitle'],
        inLanguage: language.htmlLang,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Phuket Airport Fast Track',
          url: `${BASE_URL}/`,
        },
        about: {
          '@id': `${BASE_URL}/#service`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/hkt-airport.png`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/#service`,
        name: t['hero.title'],
        serviceType: 'Airport VIP fast track meet and assist',
        description: t['hero.subtitle'],
        provider: {
          '@type': 'LocalBusiness',
          '@id': `${BASE_URL}/#business`,
          name: 'Phuket Airport Fast Track',
          url: `${BASE_URL}/`,
          telephone: '+66 6-4316-2330',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '222 Mai Khao, Thalang District',
            addressLocality: 'Phuket',
            postalCode: '83110',
            addressCountry: 'TH',
          },
        },
        areaServed: {
          '@type': 'Airport',
          name: 'Phuket International Airport',
          iataCode: 'HKT',
        },
        availableLanguage: languages.map((item) => item.htmlLang),
        offers: [
          {
            '@type': 'Offer',
            name: t['packages.arr.title'],
            price: '1600',
            priceCurrency: 'THB',
            url: `${BASE_URL}/arrival-fast-track/`,
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: t['packages.dep.title'],
            price: '1700',
            priceCurrency: 'THB',
            url: `${BASE_URL}/departure-vip/`,
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: t['packages.combo.title'],
            price: '3100',
            priceCurrency: 'THB',
            url: `${BASE_URL}/phuket-airport-fast-track-prices/`,
            availability: 'https://schema.org/InStock',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: language.htmlLang,
        mainEntity: faqItems,
      },
    ],
  }, null, 2).replaceAll('<', '\\u003c');
};

const renderRootFallback = (language, t) => {
  const url = languageUrl(language.code);
  const packages = [
    {
      title: t['packages.arr.title'],
      description: t['packages.arr.desc'],
      features: splitList(t['packages.arr.features']),
      price: 'THB 1,600',
      url: '/arrival-fast-track/',
    },
    {
      title: t['packages.dep.title'],
      description: t['packages.dep.desc'],
      features: splitList(t['packages.dep.features']),
      price: 'THB 1,700',
      url: '/departure-vip/',
    },
    {
      title: t['packages.combo.title'],
      description: t['packages.combo.desc'],
      features: splitList(t['packages.combo.features']),
      price: 'THB 3,100',
      url: '/phuket-airport-fast-track-prices/',
    },
  ];
  const topicLinks = [
    { url: '/arrival-fast-track/', label: t['packages.arr.title'] },
    { url: '/departure-vip/', label: t['packages.dep.title'] },
    { url: '/phuket-airport-fast-track-prices/', label: t['packages.title'] },
    { url: '/tdac-guide/', label: t['guides.tdac.t'] },
    { url: '/faq/', label: t['faq.title'] },
    { url: '/blog/', label: 'Phuket Airport guides' },
    { url: '/llms.txt', label: 'AI summary' },
  ];

  return `<div id="root">
      <main class="seo-app-fallback" aria-label="${escapeHtml(t['hero.title'])}">
        <nav class="seo-app-nav" aria-label="Primary">
${topicLinks.map((link) => `          <a href="${link.url}">${escapeHtml(link.label)}</a>`).join('\n')}
        </nav>
        <section class="seo-app-hero">
          <p class="seo-app-eyebrow">HKT · Phuket International Airport · Since 2013</p>
          <h1>${escapeHtml(t['hero.title'])}</h1>
          <p>${escapeHtml(t['hero.subtitle'])}</p>
          <div class="seo-app-cta">
            <a href="https://wa.me/79697189210">${escapeHtml(t['hero.cta.wa'])}</a>
            <a href="https://t.me/fasttrackphuket">${escapeHtml(t['hero.cta.tg'])}</a>
            <a href="tel:+66643162330">+66 6-4316-2330</a>
          </div>
        </section>

        <section class="seo-app-facts" aria-label="Fast Track facts">
${[0, 1, 5, 2].map((index) => `          <p>${escapeHtml(t[`takeaways.${index}`])}</p>`).join('\n')}
        </section>

        <section>
          <h2>${escapeHtml(t['pkg_section.title'])}</h2>
          <p>${escapeHtml(t['pkg_section.subtitle'])}</p>
          <div class="seo-app-cards">
${packages.map((item) => `            <article>
              <h3><a href="${item.url}">${escapeHtml(item.title)}</a></h3>
              <p class="seo-app-price">${escapeHtml(item.price)}</p>
              <p>${escapeHtml(item.description)}</p>
              <ul>
${item.features.map((feature) => `                <li>${escapeHtml(feature)}</li>`).join('\n')}
              </ul>
            </article>`).join('\n')}
          </div>
        </section>

        <section>
          <h2>${escapeHtml(t['compare.title'])}</h2>
          <table>
            <thead>
              <tr>
                <th>${escapeHtml(t['compare.th1'])}</th>
                <th>${escapeHtml(t['compare.th2'])}</th>
                <th>${escapeHtml(t['compare.th3'])}</th>
              </tr>
            </thead>
            <tbody>
${[1, 2, 3, 4, 5, 6, 7].map((index) => `              <tr>
                <td>${escapeHtml(t[`compare.f${index}`])}</td>
                <td>${escapeHtml(t[`compare.r${index}.1`])}</td>
                <td>${escapeHtml(t[`compare.r${index}.2`])}</td>
              </tr>`).join('\n')}
            </tbody>
          </table>
        </section>

        <section>
          <h2>${escapeHtml(t['guides.tdac.t'])}</h2>
          <p>${escapeHtml(t['guides.tdac.d'])}</p>
          <p><a href="/tdac-guide/">${escapeHtml(t['guides.tdac.cta'])}</a></p>
        </section>

        <section>
          <h2>${escapeHtml(t['faq.title'])}</h2>
${[1, 2, 3, 4, 5, 6].map((index) => `          <article>
            <h3>${escapeHtml(t[`faq.${index}.q`])}</h3>
            <p>${escapeHtml(t[`faq.${index}.a`])}</p>
          </article>`).join('\n')}
        </section>

        <section>
          <h2>Search and AI resources</h2>
          <p><a href="/sitemap.xml">XML sitemap</a> · <a href="/robots.txt">robots.txt</a> · <a href="/ai.txt">AI permissions</a> · <a href="/llms-full.txt">Full machine-readable context</a></p>
        </section>
        <script type="application/ld+json">
${renderStructuredData(language, t, url)}
        </script>
      </main>
    </div>`;
};

const injectRootFallback = (html, language, locale) => html.replace(
  /<div id="root"><\/div>/,
  renderRootFallback(language, locale),
);

const englishLanguage = languages.find((language) => language.code === 'en');
const englishLocale = JSON.parse(fs.readFileSync(path.join(localeDir, 'en.json'), 'utf8'));
fs.writeFileSync(appHtmlPath, injectRootFallback(appHtml, englishLanguage, englishLocale));

for (const language of languages.filter((item) => item.code !== 'en')) {
  const locale = JSON.parse(fs.readFileSync(path.join(localeDir, `${language.code}.json`), 'utf8'));
  const url = languageUrl(language.code);
  const title = `${locale['hero.title']} | Phuket Airport Fast Track`;
  const description = locale['hero.subtitle'];

  let localizedHtml = injectRootFallback(appHtml, language, locale);

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

console.log(`Generated crawlable app HTML for ${languages.length} languages from the built React shell`);
