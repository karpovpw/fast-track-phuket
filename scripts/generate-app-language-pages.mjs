import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASE_URL,
  BUSINESS,
  languages,
  thbPrices,
  faqItemIndexes,
  priceCurrencyFor,
  roundedLocalizedAmount,
  formatLocalizedPrice,
  escapeHtml,
  splitList,
  languageUrl,
  localBusinessNode,
  webSiteNode,
  serializeJsonLd,
} from './site-shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const localeDir = path.join(projectRoot, 'src', 'locales');

const replaceTag = (html, pattern, replacement) => html.replace(pattern, replacement);

const appHtmlPath = path.join(distDir, 'index.html');
const appHtml = fs.readFileSync(appHtmlPath, 'utf8');

const renderLicenseNotice = (t) => `        <section class="license-panel seo-app-license" aria-labelledby="seo-license-title">
          <figure class="license-image-card">
            <img src="/tat-license.jpeg" alt="${escapeHtml(t['license.imageAlt'])}" loading="lazy" width="930" height="1280" decoding="async" />
          </figure>
          <div class="license-copy">
            <p class="license-kicker">${escapeHtml(t['license.badge'])}</p>
            <h2 id="seo-license-title">${escapeHtml(t['license.title'])}</h2>
            <p>${escapeHtml(t['license.desc'])}</p>
            <p class="license-id">TAT License No. 11/07698 · ILVES TOUR CO., LTD.</p>
          </div>
        </section>`;

const renderArrivalMeetingNotice = (t) => `        <section class="seo-app-meeting" aria-labelledby="seo-meeting-title">
          <div>
            <p class="seo-app-eyebrow">${escapeHtml(t['meeting.badge'])}</p>
            <h2 id="seo-meeting-title">${escapeHtml(t['meeting.title'])}</h2>
            <p>${escapeHtml(t['meeting.desc'])}</p>
            <ol>
              <li>${escapeHtml(t['meeting.order.1.before'])}<strong>${escapeHtml(t['meeting.order.1.strong'])}</strong>${escapeHtml(t['meeting.order.1.after'])}</li>
              <li>${escapeHtml(t['meeting.order.2'])}</li>
              <li>${escapeHtml(t['meeting.order.3'])}</li>
            </ol>
            <p>${escapeHtml(t['meeting.note'])}</p>
          </div>
          <figure>
            <img src="/arrival-meeting-point.png" alt="${escapeHtml(t['meeting.imageAlt'])}" loading="lazy" width="1368" height="1149" decoding="async" />
          </figure>
        </section>`;

// The one and only JSON-LD graph for the home page of each language.
// index.html deliberately carries no schema of its own — everything lives
// here so entity data cannot drift between head and body copies.
const renderStructuredData = (language, t, url) => {
  const faqItems = faqItemIndexes.map((index) => ({
    '@type': 'Question',
    name: t[`faq.${index}.q`],
    acceptedAnswer: {
      '@type': 'Answer',
      text: t[`faq.${index}.a`],
    },
  }));

  return serializeJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      webSiteNode(),
      localBusinessNode(),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: t['hero.title'],
        description: t['hero.subtitle'],
        inLanguage: language.htmlLang,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#service` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: BUSINESS.imageUrl,
        },
      },
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/#service`,
        name: t['hero.title'],
        serviceType: 'Airport VIP fast track meet and assist',
        description: t['hero.subtitle'],
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: {
          '@type': 'Airport',
          name: BUSINESS.airport.name,
          iataCode: BUSINESS.airport.iataCode,
        },
        availableLanguage: languages.map((item) => item.htmlLang),
        offers: [
          {
            '@type': 'Offer',
            name: t['packages.arr.title'],
            price: String(roundedLocalizedAmount(thbPrices.arr.adult, language.code)),
            priceCurrency: priceCurrencyFor(language.code),
            url: `${BASE_URL}/arrival-fast-track/`,
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: t['packages.dep.title'],
            price: String(roundedLocalizedAmount(thbPrices.dep.adult, language.code)),
            priceCurrency: priceCurrencyFor(language.code),
            url: `${BASE_URL}/departure-vip/`,
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: t['packages.combo.title'],
            price: String(roundedLocalizedAmount(thbPrices.combo.adult, language.code)),
            priceCurrency: priceCurrencyFor(language.code),
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
  });
};

const renderRootFallback = (language, t) => {
  const url = languageUrl(language.code);
  const packages = [
    {
      title: t['packages.arr.title'],
      description: t['packages.arr.desc'],
      features: splitList(t['packages.arr.features']),
      price: formatLocalizedPrice(thbPrices.arr.adult, language.code),
      url: '/arrival-fast-track/',
    },
    {
      title: t['packages.dep.title'],
      description: t['packages.dep.desc'],
      features: splitList(t['packages.dep.features']),
      price: formatLocalizedPrice(thbPrices.dep.adult, language.code),
      url: '/departure-vip/',
    },
    {
      title: t['packages.combo.title'],
      description: t['packages.combo.desc'],
      features: splitList(t['packages.combo.features']),
      price: formatLocalizedPrice(thbPrices.combo.adult, language.code),
      url: '/phuket-airport-fast-track-prices/',
    },
  ];
  const topicLinks = [
    { url: '/arrival-fast-track/', label: t['packages.arr.title'] },
    { url: '/departure-vip/', label: t['packages.dep.title'] },
    { url: '/phuket-airport-fast-track-prices/', label: t['packages.title'] },
    { url: '/tdac-guide/', label: t['guides.tdac.t'] },
    { url: '/faq/', label: t['faq.title'] },
    { url: language.code === 'en' ? '/blog/' : `/${language.code}/blog/`, label: t['footer.nav.blog'] },
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
            <a href="${BUSINESS.whatsappUrl}">${escapeHtml(t['hero.cta.wa'])}</a>
            <a href="${BUSINESS.telegramUrl}">${escapeHtml(t['hero.cta.tg'])}</a>
            <a href="${BUSINESS.phoneHref}">${BUSINESS.telephone}</a>
          </div>
        </section>

        <section class="seo-app-facts" aria-label="Fast Track facts">
${[0, 1, 5, 2].map((index) => `          <p>${escapeHtml(t[`takeaways.${index}`])}</p>`).join('\n')}
        </section>

${renderLicenseNotice(t)}

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

${renderArrivalMeetingNotice(t)}

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
${faqItemIndexes.map((index) => `          <article>
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

// seo-fallback markers let generate-payment-route-fallbacks.mjs strip the
// prerendered content back out without depending on the markup inside.
const injectRootFallback = (html, language, locale) => html.replace(
  /<div id="root"><\/div>/,
  `<!-- seo-fallback:start -->${renderRootFallback(language, locale)}<!-- seo-fallback:end -->`,
);

const englishLanguage = languages.find((language) => language.code === 'en');
const englishLocale = JSON.parse(fs.readFileSync(path.join(localeDir, 'en.json'), 'utf8'));
fs.writeFileSync(appHtmlPath, injectRootFallback(appHtml, englishLanguage, englishLocale));

for (const language of languages.filter((item) => item.code !== 'en')) {
  const locale = JSON.parse(fs.readFileSync(path.join(localeDir, `${language.code}.json`), 'utf8'));
  const url = languageUrl(language.code);
  const title = `${locale['hero.title']} | VIP Fast Track Phuket Airport (HKT)`;
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
