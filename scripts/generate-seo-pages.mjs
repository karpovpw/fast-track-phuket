import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';
const LASTMOD = '2026-05-14';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const localeDir = path.join(projectRoot, 'src', 'locales');

const languages = [
  { code: 'en', name: 'English', htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US' },
  { code: 'ru', name: 'Русский', htmlLang: 'ru', dir: 'ltr', ogLocale: 'ru_RU' },
  { code: 'zh', name: '中文', htmlLang: 'zh', dir: 'ltr', ogLocale: 'zh_CN' },
  { code: 'hi', name: 'हिन्दी', htmlLang: 'hi', dir: 'ltr', ogLocale: 'hi_IN' },
  { code: 'he', name: 'עברית', htmlLang: 'he', dir: 'rtl', ogLocale: 'he_IL' },
  { code: 'ar', name: 'العربية', htmlLang: 'ar', dir: 'rtl', ogLocale: 'ar_AR' },
  { code: 'es', name: 'Español', htmlLang: 'es', dir: 'ltr', ogLocale: 'es_ES' },
  { code: 'fr', name: 'Français', htmlLang: 'fr', dir: 'ltr', ogLocale: 'fr_FR' },
  { code: 'de', name: 'Deutsch', htmlLang: 'de', dir: 'ltr', ogLocale: 'de_DE' },
  { code: 'it', name: 'Italiano', htmlLang: 'it', dir: 'ltr', ogLocale: 'it_IT' },
];

const supportingUrls = [
  { loc: `${BASE_URL}/arrival-fast-track/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/departure-vip/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/phuket-airport-fast-track-prices/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/tdac-guide/`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${BASE_URL}/faq/`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/llms.txt`, priority: '0.3', changefreq: 'monthly' },
  { loc: `${BASE_URL}/llms-full.txt`, priority: '0.3', changefreq: 'monthly' },
  { loc: `${BASE_URL}/ai.txt`, priority: '0.3', changefreq: 'monthly' },
];

const languageUrl = (code) => code === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${code}/`;

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const escapeXml = escapeHtml;

const loadLocale = (code) => JSON.parse(
  fs.readFileSync(path.join(localeDir, `${code}.json`), 'utf8')
);

const splitList = (value) => String(value || '').split('|').filter(Boolean);

const alternateLinksHtml = () => [
  ...languages.map((language) => (
    `    <link rel="alternate" hreflang="${language.htmlLang}" href="${languageUrl(language.code)}" />`
  )),
  `    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`,
].join('\n');

const alternateLinksXml = () => [
  ...languages.map((language) => (
    `    <xhtml:link rel="alternate" hreflang="${language.htmlLang}" href="${languageUrl(language.code)}" />`
  )),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`,
].join('\n');

const renderStructuredData = (language, t, url) => {
  const faqItems = [1, 2, 3, 4, 5, 6].map((index) => ({
    '@type': 'Question',
    name: t[`faq.${index}.q`],
    acceptedAnswer: {
      '@type': 'Answer',
      text: t[`faq.${index}.a`],
    },
  }));

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: t['hero.title'],
      description: t['hero.subtitle'],
      inLanguage: language.htmlLang,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: 'Phuket Airport Fast Track',
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
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
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
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: language.htmlLang,
      mainEntity: faqItems,
    },
  ];

  return JSON.stringify(graph, null, 2).replaceAll('<', '\\u003c');
};

const renderLanguagePage = (language, t) => {
  const url = languageUrl(language.code);
  const title = `${t['hero.title']} | Phuket Airport Fast Track`;
  const description = t['hero.subtitle'];
  const facts = [
    t['takeaways.1'],
    t['takeaways.3'],
    t['takeaways.5'],
    t['takeaways.0'],
  ];
  const packageCards = [
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

  return `<!doctype html>
<html lang="${language.htmlLang}" dir="${language.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="stylesheet" href="/seo.css" />
    <link rel="sitemap" type="application/xml" href="${BASE_URL}/sitemap.xml" />
${alternateLinksHtml()}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${BASE_URL}/hkt-airport.png" />
    <meta property="og:site_name" content="Phuket Airport Fast Track" />
    <meta property="og:locale" content="${language.ogLocale}" />
    <script type="application/ld+json">
${renderStructuredData(language, t, url)}
    </script>
  </head>
  <body>
    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/arrival-fast-track/">${escapeHtml(t['packages.arr.title'])}</a>
      <a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a>
      <a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.title'])}</a>
      <a href="/tdac-guide/">${escapeHtml(t['guides.tdac.t'])}</a>
      <a href="/faq/">${escapeHtml(t['faq.title'])}</a>
      <a href="/llms.txt">AI summary</a>
    </nav>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">HKT · Phuket International Airport · Since 2013</p>
          <h1>${escapeHtml(t['hero.title'])}</h1>
          <p>${escapeHtml(t['hero.subtitle'])}</p>
          <div class="cta">
            <a class="button" href="https://wa.me/79697189210">${escapeHtml(t['hero.cta.wa'])}</a>
            <a class="button" href="https://t.me/fasttrackphuket">${escapeHtml(t['hero.cta.tg'])}</a>
          </div>
        </div>
        <img src="/hkt-airport.png" alt="Phuket International Airport HKT VIP fast track" />
      </section>

      <section class="fact-grid" aria-label="Fast Track facts">
${facts.map((fact) => `        <div class="fact">${escapeHtml(fact)}</div>`).join('\n')}
      </section>

      <section>
        <h2>${escapeHtml(t['pkg_section.title'])}</h2>
        <p>${escapeHtml(t['pkg_section.subtitle'])}</p>
        <div class="cards">
${packageCards.map((card) => `          <article class="card">
            <h3><a href="${card.url}">${escapeHtml(card.title)}</a></h3>
            <p class="price">${escapeHtml(card.price)}</p>
            <p>${escapeHtml(card.description)}</p>
            <ul>
${card.features.map((feature) => `              <li>${escapeHtml(feature)}</li>`).join('\n')}
            </ul>
          </article>`).join('\n')}
        </div>
      </section>

      <section>
        <h2>${escapeHtml(t['packages.title'])}</h2>
        <p>${escapeHtml(t['packages.subtitle'])}</p>
        <table>
          <thead>
            <tr>
              <th>${escapeHtml(t['packages.th1'])}</th>
              <th>${escapeHtml(t['packages.th2'])}</th>
              <th>${escapeHtml(t['packages.th3'].replace('|', ' '))}</th>
              <th>${escapeHtml(t['packages.th4'].replace('|', ' '))}</th>
              <th>${escapeHtml(t['packages.th5'].replace('|', ' '))}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/arrival-fast-track/">${escapeHtml(t['packages.arr.title'])}</a></td>
              <td>THB 1,700</td>
              <td>THB 1,600</td>
              <td>THB 850</td>
              <td>Free</td>
            </tr>
            <tr>
              <td><a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a></td>
              <td>THB 1,800</td>
              <td>THB 1,700</td>
              <td>THB 900</td>
              <td>Free</td>
            </tr>
            <tr>
              <td><a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.combo.title'])}</a></td>
              <td>THB 3,300</td>
              <td>THB 3,100</td>
              <td>THB 1,650</td>
              <td>Free</td>
            </tr>
          </tbody>
        </table>
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
${[1, 2, 3, 4, 5, 6, 7].map((index) => `            <tr>
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
${[1, 2, 3, 4, 5, 6].map((index) => `        <article>
          <h3>${escapeHtml(t[`faq.${index}.q`])}</h3>
          <p>${escapeHtml(t[`faq.${index}.a`])}</p>
        </article>`).join('\n')}
      </section>

      <section>
        <h2>Languages</h2>
        <p class="language-switcher">
${languages.map((item) => `          <a href="${item.code === 'en' ? '/' : `/${item.code}/`}"${item.code === language.code ? ' aria-current="page"' : ''}>${escapeHtml(item.name)}</a>`).join('\n')}
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Phone: <a href="tel:+66643162330">+66 6-4316-2330</a>. WhatsApp: <a href="https://wa.me/79697189210">+7 969-718-9210</a>. Telegram: <a href="https://t.me/fasttrackphuket">@fasttrackphuket</a>.</p>
      </section>
    </main>
    <footer>
      <p>Phuket Airport Fast Track · 222 Mai Khao, Thalang District, Phuket 83110, Thailand · <a href="/ai.txt">AI permissions</a> · <a href="/sitemap.xml">Sitemap</a></p>
    </footer>
  </body>
</html>
`;
};

const renderSitemap = () => {
  const homeEntries = languages.map((language) => `  <url>
    <loc>${languageUrl(language.code)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${language.code === 'en' ? '1.0' : '0.95'}</priority>
${alternateLinksXml()}
  </url>`);

  const supportingEntries = supportingUrls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...homeEntries, ...supportingEntries].join('\n')}
</urlset>
`;
};

for (const language of languages.filter((item) => item.code !== 'en')) {
  const locale = loadLocale(language.code);
  const outputDir = path.join(publicDir, language.code);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderLanguagePage(language, locale));
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), renderSitemap());

console.log(`Generated ${languages.length - 1} localized SEO pages and sitemap.xml`);
