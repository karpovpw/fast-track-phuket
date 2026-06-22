import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';
// Sitemap lastmod / dateModified track the actual build so freshness is honest;
// datePublished stays fixed so guide articles keep a stable original publish date.
const LASTMOD = new Date().toISOString().slice(0, 10);
const PUBLISHED = '2026-06-05';
const HERO_IMAGE = `${BASE_URL}/hkt-airport.png`;

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

const thbPrices = {
  arr: { single: 1700, group: 1600, child: 850 },
  dep: { single: 1800, group: 1700, child: 900 },
  combo: { single: 3300, group: 3100, child: 1650 },
};

const priceCurrency = 'THB';

const roundedLocalizedAmount = (thbAmount) => thbAmount;

const formatLocalizedPrice = (thbAmount) => {
  return `THB ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(thbAmount)}`;
};

const p = (packageCode, priceType) => formatLocalizedPrice(thbPrices[packageCode][priceType]);

const blogPages = [
  {
    slug: 'fast-track-phuket-airport-complete-guide-2026',
    title: 'VIP Fast Track Phuket Airport (HKT) Complete Guide 2026',
    description: 'A practical 2026 guide to VIP Fast Track Phuket Airport (HKT): arrival immigration, departure VIP assistance, prices, TDAC, booking timing, and when VIP escort is worth it.',
    summary: 'Use this guide if you are comparing regular immigration with VIP meet-and-assist at Phuket International Airport. It explains what the escort does, what still remains the traveler responsibility, and which package fits each trip.',
    keywords: ['VIP Fast Track Phuket Airport (HKT)', 'HKT VIP service', 'Phuket airport immigration', 'VIP meet and assist Phuket'],
    sections: [
      {
        heading: 'What VIP Fast Track Phuket Airport (HKT) means',
        paragraphs: [
          'VIP Fast Track Phuket Airport (HKT) is a VIP meet-and-assist service for international passengers using Phuket International Airport (HKT). Instead of finding the right immigration flow alone, the passenger is met by an airport escort and guided through the airport steps that apply to the booking.',
          'Fast Track is not a visa, government exemption, or shortcut around Thai immigration requirements. Travelers still need valid documents and must complete any required entry forms. The value is operational: meeting coordination, priority-lane guidance when available, terminal navigation, and support when flight timing changes.',
        ],
      },
      {
        heading: 'Arrival Fast Track process',
        paragraphs: [
          'For arrivals, the team monitors the flight and positions the escort for the actual landing time. The meeting point is normally at the aircraft bridge or the airport-designated immigration-zone meeting area, depending on gate and airport procedure for that flight.',
          'After meeting the passenger, the escort guides the traveler toward the correct immigration flow, assists with airport navigation after passport control, and helps coordinate the exit, luggage flow, customs route, taxi, or driver meeting when needed.',
        ],
      },
      {
        heading: 'Departure VIP process',
        paragraphs: [
          'For departures, the meeting is arranged at the international terminal entrance. The escort helps the passenger move through the terminal flow, including check-in coordination when useful, passport-control guidance, security navigation, and movement toward the gate area.',
          'Departure VIP is most useful for families, travelers with tight schedules, business passengers, senior travelers, and anyone leaving during peak Phuket travel windows when terminal pressure is higher.',
        ],
      },
      {
        heading: 'Prices and package choice',
        paragraphs: [
          `Arrival Fast Track starts from ${p('arr', 'group')} per person for two or more passengers, with a single-passenger rate of ${p('arr', 'single')}. Departure VIP starts from ${p('dep', 'group')} per person for two or more passengers, with a single-passenger rate of ${p('dep', 'single')}. The arrival plus departure combo starts from ${p('combo', 'group')} per person for two or more passengers.`,
          'Children under 12 receive a 50% discount and infants from 0 to 2 years are free. For travelers who need both landing and return-flight assistance, the combo is usually the simplest booking because it combines both airport directions and support in one conversation.',
        ],
      },
      {
        heading: 'TDAC and traveler documents',
        paragraphs: [
          'Fast Track does not remove the requirement to complete the Thailand Digital Arrival Card when it applies. The service can provide TDAC guidance, and the website keeps a dedicated TDAC guide for travelers who want to understand the form before arrival.',
          'Passengers should still travel with a valid passport, visa or visa-exemption eligibility where applicable, onward travel details when required, and any documents requested by Thai immigration or airline staff.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is VIP Fast Track Phuket Airport (HKT) available for all international flights?',
        a: 'The service is available for international flights at Phuket International Airport, subject to booking availability and current airport procedure.',
      },
      {
        q: 'How early should I book Fast Track at HKT?',
        a: 'Booking at least 24 hours before travel is recommended. During peak season, 48 to 72 hours gives better availability.',
      },
      {
        q: 'Does VIP Fast Track guarantee immigration approval?',
        a: 'No. Immigration decisions remain with Thai authorities. Fast Track provides meet-and-assist guidance through the airport process.',
      },
    ],
  },
  {
    slug: 'phuket-airport-arrival-fast-track-immigration',
    title: 'Phuket Airport Arrival Fast Track Immigration Guide',
    description: 'Step-by-step guide to Arrival Fast Track at Phuket Airport: meeting point, immigration guidance, luggage flow, flight delays, TDAC, and who should book.',
    summary: 'Arrival Fast Track is designed for passengers landing at HKT who want a smoother route from aircraft arrival to airport exit with a personal escort.',
    keywords: ['Phuket arrival fast track', 'HKT immigration fast track', 'Phuket airport arrival VIP'],
    sections: [
      {
        heading: 'Who Arrival Fast Track is for',
        paragraphs: [
          'Arrival Fast Track is most useful when the first hour in Phuket matters. Families with children, senior passengers, travelers arriving after a long-haul flight, guests with a driver waiting outside, and business travelers all benefit from having a clear meeting process and a guided route through the airport.',
          'The service is also useful during high-arrival periods. Phuket immigration queues can vary sharply by season, time of day, and number of international flights landing together. A personal escort reduces uncertainty even when airport conditions are busy.',
        ],
      },
      {
        heading: 'Arrival meeting point',
        paragraphs: [
          'The team monitors the flight and adjusts for delays. On arrival, the escort meets the passenger at the aircraft bridge or an airport-designated meeting point near the immigration area. The exact meeting process depends on gate assignment and operational rules at HKT that day.',
          'The passenger should keep phone access available after landing when possible. If the aircraft parks remotely, or if the airport changes the gate, the escort arrangement follows the live flight situation rather than the original timetable alone.',
        ],
      },
      {
        heading: 'Immigration and terminal flow',
        paragraphs: [
          'After meeting, the escort guides the passenger toward the appropriate immigration channel and helps with the airport route. Fast Track does not replace passport checks, visa rules, or immigration decisions, but it helps travelers avoid confusion and unnecessary waiting where priority-lane guidance is available.',
          'After passport control, the escort can help direct the passenger toward baggage claim, customs flow, the arrival hall, taxi coordination, or a private driver meeting point.',
        ],
      },
      {
        heading: 'What to prepare before landing',
        paragraphs: [
          'Travelers should have passport, boarding pass, arrival details, accommodation address, and TDAC information ready if required. Preparing these details before landing reduces friction at immigration and helps the airport escort keep the process smooth.',
          'If traveling as a family or group, book everyone under the same flight details and provide passenger names exactly as they appear in passports. That reduces coordination problems at the meeting point.',
        ],
      },
    ],
    faq: [
      {
        q: 'Where will the escort meet me on arrival?',
        a: 'Arrivals are usually met at the aircraft bridge or an airport-designated meeting point near immigration, depending on HKT operations for the flight.',
      },
      {
        q: 'What if my flight is delayed?',
        a: 'Flight status is monitored and the escort schedule is adjusted for the updated arrival time.',
      },
      {
        q: 'Can Arrival Fast Track help with luggage or driver coordination?',
        a: 'The escort can help with terminal direction, baggage-flow coordination, and finding the agreed exit or driver meeting point when needed.',
      },
    ],
  },
  {
    slug: 'phuket-airport-departure-vip-service',
    title: 'Phuket Airport Departure VIP Service Guide',
    description: 'Guide to Departure VIP assistance at Phuket Airport: terminal meeting, check-in support, passport control, security, gate escort, timing, and pricing.',
    summary: 'Departure VIP is built for travelers leaving Phuket who want structured terminal assistance before their international flight.',
    keywords: ['Phuket departure VIP', 'HKT departure fast track', 'Phuket airport passport control'],
    sections: [
      {
        heading: 'How Departure VIP starts',
        paragraphs: [
          'Departure assistance starts at the international terminal entrance at an agreed time. The escort confirms passenger details, reviews the flight, and helps the traveler move into the correct terminal flow.',
          'The service can help with check-in coordination when useful, but airline rules still apply. Oversized luggage, document checks, special airline requirements, and late passenger arrival remain under airline and airport control.',
        ],
      },
      {
        heading: 'Passport control and security guidance',
        paragraphs: [
          'After check-in, the escort guides the passenger toward the appropriate passport-control and security process. For many travelers, the biggest benefit is not only shorter waiting but also knowing which route to take in a busy international terminal.',
          'The escort continues guidance toward the gate area after formalities. This is helpful for travelers unfamiliar with HKT, families managing children and cabin bags, or passengers who prefer direct airport support rather than navigating alone.',
        ],
      },
      {
        heading: 'When to book departure assistance',
        paragraphs: [
          'Book Departure VIP if your flight is during a known peak window, if you are traveling with a group, if the passenger needs calm guidance, or if you have a high-value connection after leaving Phuket. The service is also useful when you want a single point of contact for airport timing questions.',
          'Travelers should still arrive at the airport with enough time for airline check-in, baggage drop, document checks, and boarding. Fast Track improves the airport flow, but it does not make late airport arrival risk-free.',
        ],
      },
      {
        heading: 'Departure pricing',
        paragraphs: [
          `Departure VIP starts from ${p('dep', 'group')} per person for two or more passengers. A single passenger is ${p('dep', 'single')}. Children under 12 receive a 50% discount and infants from 0 to 2 years are free.`,
          `Travelers booking both arrival and departure should compare the combo package, which starts from ${p('combo', 'group')} per person for two or more passengers.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Where do I meet the departure escort?',
        a: 'The departure escort meets passengers at the agreed international terminal entrance point.',
      },
      {
        q: 'Does Departure VIP include airline check-in?',
        a: 'It includes guidance and coordination when airline counter support is needed, but airline rules and document checks still apply.',
      },
      {
        q: 'Can I book Departure VIP only?',
        a: 'Yes. Departure VIP can be booked as a standalone service or as part of the arrival plus departure combo.',
      },
    ],
  },
  {
    slug: 'phuket-airport-fast-track-prices-worth-it',
    title: 'Is VIP Fast Track Phuket Airport (HKT) Worth It? Prices and Use Cases',
    description: 'Compare VIP Fast Track Phuket Airport (HKT) prices with regular HKT immigration and learn when VIP meet-and-assist is worth booking for arrivals, departures, families, and groups.',
    summary: 'Fast Track is worth it when time, certainty, family comfort, or airport support matters more than the lowest possible transfer cost.',
    keywords: ['Phuket fast track price', 'Phuket airport fast track worth it', 'HKT VIP price'],
    sections: [
      {
        heading: 'Current price anchors',
        paragraphs: [
          `The main price anchors are ${p('arr', 'group')} per person for Arrival Fast Track when booking two or more passengers, ${p('dep', 'group')} per person for Departure VIP when booking two or more passengers, and ${p('combo', 'group')} per person for the arrival plus departure combo.`,
          `Single-passenger pricing is ${p('arr', 'single')} for arrival, ${p('dep', 'single')} for departure, and ${p('combo', 'single')} for the combo. Children under 12 receive a 50% discount, and infants from 0 to 2 years are free.`,
        ],
      },
      {
        heading: 'When the value is strongest',
        paragraphs: [
          'The value is strongest when standard immigration or terminal navigation could affect the rest of the trip. A tired family arriving after a night flight, a senior passenger who wants direct guidance, a business traveler with a scheduled driver, or a group with several passports can all save stress with a personal escort.',
          'Fast Track can also be valuable during Phuket peak season. Queue length changes by day and flight wave, but the practical problem is uncertainty: travelers often do not know how busy immigration will be until they arrive.',
        ],
      },
      {
        heading: 'When regular airport flow may be enough',
        paragraphs: [
          'Regular airport flow may be enough for solo travelers with flexible time, light luggage, no onward schedule, and comfort navigating international airports. If a traveler is price-sensitive and not concerned about queue variability, Fast Track may be optional rather than necessary.',
          'The decision should be based on trip context, not only average waiting time. A short wait on one day does not remove the benefit for passengers who need reliability on another day.',
        ],
      },
      {
        heading: 'How to choose the package',
        paragraphs: [
          'Choose Arrival Fast Track if the main problem is landing smoothly and reaching the hotel, villa, marina, or driver faster. Choose Departure VIP if the stressful part is leaving Phuket, dealing with check-in, and clearing passport control. Choose the combo if you want both directions handled in one booking.',
          'For families and groups, the group rate and child discount usually make the per-person value clearer than buying separate single-passenger services.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the cheapest VIP Fast Track Phuket Airport (HKT) option?',
        a: `Arrival Fast Track starts from ${p('arr', 'group')} per person for two or more passengers.`,
      },
      {
        q: 'Is Fast Track worth it for families?',
        a: 'It is often worth it for families because children, luggage, and long-haul fatigue make airport uncertainty more expensive in practice.',
      },
      {
        q: 'Is the combo cheaper than booking arrival and departure separately?',
        a: `The combo starts from ${p('combo', 'group')} per person for two or more passengers and is usually the simplest option for travelers who need both directions.`,
      },
    ],
  },
  {
    slug: 'phuket-airport-peak-season-immigration-tips',
    title: 'Phuket Airport Peak Season Immigration Tips',
    description: 'Practical HKT peak-season immigration tips for international arrivals and departures, including timing, documents, TDAC, Fast Track, and family travel.',
    summary: 'Peak season at Phuket Airport increases the cost of uncertainty. Prepare documents early, book airport assistance ahead, and avoid relying on last-minute fixes.',
    keywords: ['Phuket airport peak season', 'HKT immigration queue', 'Phuket airport tips'],
    sections: [
      {
        heading: 'Why peak season changes the airport experience',
        paragraphs: [
          'Phuket peak travel periods can place multiple international flight waves close together. When several aircraft arrive near the same time, immigration and baggage areas become more crowded and the airport experience becomes less predictable.',
          'Departure pressure can also rise when tour groups, families, and long-haul flights overlap. Even travelers who know HKT well can face longer check-in, passport-control, or security movement during busy windows.',
        ],
      },
      {
        heading: 'Arrival tips',
        paragraphs: [
          'Complete TDAC requirements before arrival when applicable, keep passport and accommodation details ready, and make sure the passenger name in any Fast Track booking matches the passport. If a driver is meeting you, share the driver contact or meeting plan with your airport support contact before landing.',
          'If traveling with children or senior passengers, plan for phone battery, water after landing, and a clear group meeting process. Small preparation reduces stress when the arrival hall is busy.',
        ],
      },
      {
        heading: 'Departure tips',
        paragraphs: [
          'Do not compress airport arrival time just because a VIP service is booked. Airline check-in deadlines and document checks still matter. Fast Track is best used to make a sensible airport schedule smoother, not to rescue an impossible timeline.',
          'For international departures, confirm terminal, luggage allowance, and any airline-specific document requirements before leaving the hotel or villa. The escort can help with airport flow, but the traveler controls the readiness of documents and baggage.',
        ],
      },
      {
        heading: 'Booking timing during peak season',
        paragraphs: [
          'Book at least 24 hours before travel when possible, and 48 to 72 hours ahead for peak dates. Same-day requests may be possible, but availability is less predictable when airport demand is high.',
          'Provide flight number, passenger names, contact channel, and service direction at the time of booking. This helps the team monitor the correct flight and avoid unnecessary back-and-forth during busy periods.',
        ],
      },
    ],
    faq: [
      {
        q: 'When is Phuket Airport busiest?',
        a: 'Airport load varies by season and flight wave. Peak leisure travel periods and overlapping international arrivals can create longer immigration queues.',
      },
      {
        q: 'Should I book Fast Track during peak season?',
        a: 'If queue time, family comfort, or schedule certainty matters, booking Fast Track during peak season is usually more valuable than waiting until arrival.',
      },
      {
        q: 'Can Fast Track fix a late departure arrival?',
        a: 'No service can override airline check-in deadlines. Departure VIP should be paired with sensible airport arrival timing.',
      },
    ],
  },
  {
    slug: 'tdac-phuket-airport-fast-track-guide',
    title: 'TDAC and VIP Fast Track Phuket Airport (HKT) Guide',
    description: 'How TDAC fits with VIP Fast Track Phuket Airport (HKT): what travelers still need to complete, how VIP assistance helps, and what to prepare before arriving in Thailand.',
    summary: 'TDAC and Fast Track solve different problems. TDAC is an entry-information requirement when applicable; Fast Track is airport meet-and-assist support.',
    keywords: ['TDAC Phuket Airport', 'Thailand Digital Arrival Card Phuket', 'Fast Track TDAC'],
    sections: [
      {
        heading: 'TDAC is separate from Fast Track',
        paragraphs: [
          'The Thailand Digital Arrival Card is a traveler information requirement when it applies. VIP Fast Track Phuket Airport (HKT) does not remove TDAC, visa, passport, customs, or immigration obligations.',
          'The role of Fast Track is to help the passenger move through the airport process with a personal escort. The role of TDAC is to provide arrival information before entering Thailand. Treat them as separate parts of the same trip preparation.',
        ],
      },
      {
        heading: 'What travelers should prepare',
        paragraphs: [
          'Travelers should prepare passport details, flight details, accommodation address, contact information, and any other entry information requested by the official Thai process. Avoid unofficial paid imitation forms and use the official channel when completing government entry information.',
          'If you are unsure what to prepare, use the website TDAC guide before travel and contact the Fast Track team through WhatsApp or Telegram for service-specific guidance.',
        ],
      },
      {
        heading: 'How Fast Track helps around TDAC',
        paragraphs: [
          'For combo bookings, TDAC guidance is included as part of the broader arrival and departure support. This helps travelers understand what needs to be done before travel and reduces last-minute confusion after landing.',
          'Fast Track can make the airport route smoother, but travelers should not wait until the immigration counter to think about TDAC. Completing required information ahead of time is the safer approach.',
        ],
      },
      {
        heading: 'Best practice before flying to Phuket',
        paragraphs: [
          'Complete required entry information before departure, save confirmation details where applicable, keep your passport accessible, and share accurate flight information when booking airport assistance.',
          'If the flight changes, notify the Fast Track team through the same booking channel so escort timing can be adjusted.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Fast Track replace TDAC?',
        a: 'No. Travelers still need to complete TDAC when it applies.',
      },
      {
        q: 'Can the team help me understand TDAC?',
        a: 'Yes. TDAC guidance is included with the combo package, and the website has a dedicated TDAC guide.',
      },
      {
        q: 'Should I complete TDAC before arrival?',
        a: 'Yes. Complete required entry information before travel when applicable to avoid avoidable airport friction.',
      },
    ],
  },
];

const supportingUrls = [
  { loc: `${BASE_URL}/arrival-fast-track/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/departure-vip/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/phuket-airport-fast-track-prices/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${BASE_URL}/tdac-guide/`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${BASE_URL}/faq/`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/blog/`, priority: '0.8', changefreq: 'weekly' },
  ...blogPages.map((page) => ({
    loc: `${BASE_URL}/blog/${page.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
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

const renderLicenseNotice = (t) => `      <section class="license-notice" aria-labelledby="license-title">
        <div class="license-warning" role="note" aria-label="${escapeHtml(t['license.warning.title'])}">
          <h3>${escapeHtml(t['license.warning.title'])}</h3>
          <p>${escapeHtml(t['license.warning.desc'])}</p>
        </div>
        <figure class="license-image-card">
          <img src="/tat-license.jpeg" alt="${escapeHtml(t['license.imageAlt'])}" loading="lazy" width="930" height="1280" decoding="async" />
        </figure>
        <div>
          <p class="eyebrow">${escapeHtml(t['license.badge'])}</p>
          <h2 id="license-title">${escapeHtml(t['license.title'])}</h2>
          <p>${escapeHtml(t['license.desc'])}</p>
        </div>
      </section>`;

const englishLocale = loadLocale('en');

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
        name: 'VIP Fast Track Phuket Airport (HKT)',
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
        name: 'VIP Fast Track Phuket Airport (HKT)',
        url: `${BASE_URL}/`,
        telephone: '+66 6-1801-6793',
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
          price: String(roundedLocalizedAmount(thbPrices.arr.group, language.code)),
          priceCurrency,
          url: `${BASE_URL}/arrival-fast-track/`,
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: t['packages.dep.title'],
          price: String(roundedLocalizedAmount(thbPrices.dep.group, language.code)),
          priceCurrency,
          url: `${BASE_URL}/departure-vip/`,
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: t['packages.combo.title'],
          price: String(roundedLocalizedAmount(thbPrices.combo.group, language.code)),
          priceCurrency,
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
  const title = `${t['hero.title']} | VIP Fast Track Phuket Airport (HKT)`;
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
      price: formatLocalizedPrice(thbPrices.arr.group, language.code),
      url: '/arrival-fast-track/',
    },
    {
      title: t['packages.dep.title'],
      description: t['packages.dep.desc'],
      features: splitList(t['packages.dep.features']),
      price: formatLocalizedPrice(thbPrices.dep.group, language.code),
      url: '/departure-vip/',
    },
    {
      title: t['packages.combo.title'],
      description: t['packages.combo.desc'],
      features: splitList(t['packages.combo.features']),
      price: formatLocalizedPrice(thbPrices.combo.group, language.code),
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
    <meta property="og:site_name" content="VIP Fast Track Phuket Airport (HKT)" />
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
            <a class="button" href="https://wa.me/66618016793">${escapeHtml(t['hero.cta.wa'])}</a>
            <a class="button" href="https://t.me/fast_track_phuket">${escapeHtml(t['hero.cta.tg'])}</a>
          </div>
        </div>
        <img src="/hkt-airport.png" alt="Phuket International Airport HKT VIP fast track" width="640" height="640" fetchpriority="high" decoding="async" />
      </section>

      <section class="fact-grid" aria-label="Fast Track facts">
${facts.map((fact) => `        <div class="fact">${escapeHtml(fact)}</div>`).join('\n')}
      </section>

${renderLicenseNotice(t)}

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
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.arr.single, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.arr.group, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.arr.child, language.code))}</td>
              <td>${escapeHtml(t['packages.price.infant'])}</td>
            </tr>
            <tr>
              <td><a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a></td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.dep.single, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.dep.group, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.dep.child, language.code))}</td>
              <td>${escapeHtml(t['packages.price.infant'])}</td>
            </tr>
            <tr>
              <td><a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.combo.title'])}</a></td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.combo.single, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.combo.group, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.combo.child, language.code))}</td>
              <td>${escapeHtml(t['packages.price.infant'])}</td>
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
        <p>Phone: <a href="tel:+66618016793">+66 6-1801-6793</a>. WhatsApp: <a href="https://wa.me/66618016793">+66 6-1801-6793</a>. Telegram: <a href="https://t.me/fast_track_phuket">@fast_track_phuket</a>.</p>
      </section>
    </main>
    <footer>
      <p>VIP Fast Track Phuket Airport (HKT) · 222 Mai Khao, Thalang District, Phuket 83110, Thailand · <a href="/ai.txt">AI permissions</a> · <a href="/sitemap.xml">Sitemap</a></p>
    </footer>
  </body>
</html>
`;
};

const renderBlogNav = () => `    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/arrival-fast-track/">Arrival Fast Track</a>
      <a href="/departure-vip/">Departure VIP</a>
      <a href="/phuket-airport-fast-track-prices/">Prices</a>
      <a href="/tdac-guide/">TDAC Guide</a>
      <a href="/faq/">FAQ</a>
      <a href="/blog/">Guides</a>
      <a href="/llms.txt">AI summary</a>
    </nav>`;

const renderBlogStructuredData = (page, url) => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: page.title,
      description: page.description,
      image: `${BASE_URL}/hkt-airport.png`,
      datePublished: PUBLISHED,
      dateModified: LASTMOD,
      author: {
        '@type': 'Organization',
        name: 'VIP Fast Track Phuket Airport (HKT)',
        url: `${BASE_URL}/`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'VIP Fast Track Phuket Airport (HKT)',
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/favicon.svg`,
        },
      },
      mainEntityOfPage: {
        '@id': `${url}#webpage`,
      },
      about: page.keywords.map((keyword) => ({
        '@type': 'Thing',
        name: keyword,
      })),
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'VIP Fast Track Phuket Airport (HKT)',
        url: `${BASE_URL}/`,
      },
      about: {
        '@id': `${BASE_URL}/#service`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${BASE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: `${BASE_URL}/blog/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.title,
          item: url,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ],
}, null, 2).replaceAll('<', '\\u003c');

const renderBlogIndexStructuredData = () => {
  const url = `${BASE_URL}/blog/`;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: 'VIP Fast Track Phuket Airport (HKT) Guides',
    description: 'Crawlable guides for VIP Fast Track Phuket Airport (HKT), VIP arrival, departure, prices, TDAC, and HKT immigration planning.',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'VIP Fast Track Phuket Airport (HKT)',
      url: `${BASE_URL}/`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blogPages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/blog/${page.slug}/`,
        name: page.title,
      })),
    },
  }, null, 2).replaceAll('<', '\\u003c');
};

const renderBlogIndexPage = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>VIP Fast Track Phuket Airport (HKT) Guides | HKT VIP Travel Advice</title>
    <meta name="description" content="Guides for VIP Fast Track Phuket Airport (HKT), arrival immigration, departure VIP service, HKT prices, TDAC, peak-season airport planning, and VIP meet-and-assist." />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${BASE_URL}/blog/" />
    <link rel="stylesheet" href="/seo.css" />
    <link rel="sitemap" type="application/xml" href="${BASE_URL}/sitemap.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${BASE_URL}/blog/" />
    <meta property="og:title" content="VIP Fast Track Phuket Airport (HKT) Guides" />
    <meta property="og:description" content="Practical HKT airport VIP guides for arrivals, departures, prices, TDAC, and peak-season immigration planning." />
    <meta property="og:image" content="${BASE_URL}/hkt-airport.png" />
    <script type="application/ld+json">
${renderBlogIndexStructuredData()}
    </script>
  </head>
  <body>
${renderBlogNav()}
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">HKT airport guides · Updated ${LASTMOD}</p>
          <h1>VIP Fast Track Phuket Airport (HKT) Guides</h1>
          <p>Practical, crawlable guidance for travelers comparing VIP Fast Track, regular immigration, TDAC preparation, departure support, and Phuket Airport peak-season planning.</p>
          <div class="cta">
            <a class="button" href="https://wa.me/66618016793">Book on WhatsApp</a>
            <a class="button" href="https://t.me/fast_track_phuket">Book on Telegram</a>
          </div>
        </div>
        <img src="/hkt-airport.png" alt="Phuket International Airport HKT" width="640" height="640" fetchpriority="high" decoding="async" />
      </section>

${renderLicenseNotice(englishLocale)}

      <section>
        <h2>All Guides</h2>
        <div class="cards">
${blogPages.map((page) => `          <article class="card">
            <h3><a href="/blog/${page.slug}/">${escapeHtml(page.title)}</a></h3>
            <p>${escapeHtml(page.description)}</p>
          </article>`).join('\n')}
        </div>
      </section>
    </main>
    <footer>
      <p>VIP Fast Track Phuket Airport (HKT) · 222 Mai Khao, Thalang District, Phuket 83110, Thailand · <a href="/ai.txt">AI permissions</a> · <a href="/sitemap.xml">Sitemap</a></p>
    </footer>
  </body>
</html>
`;

const renderBlogPage = (page) => {
  const url = `${BASE_URL}/blog/${page.slug}/`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)} | VIP Fast Track Phuket Airport (HKT)</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="stylesheet" href="/seo.css" />
    <link rel="sitemap" type="application/xml" href="${BASE_URL}/sitemap.xml" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:image" content="${BASE_URL}/hkt-airport.png" />
    <meta property="article:published_time" content="${PUBLISHED}" />
    <meta property="article:modified_time" content="${LASTMOD}" />
    <script type="application/ld+json">
${renderBlogStructuredData(page, url)}
    </script>
  </head>
  <body>
${renderBlogNav()}
    <main>
      <article>
        <header class="hero">
          <div>
            <p class="eyebrow">VIP Fast Track Phuket Airport (HKT) guide · Updated ${LASTMOD}</p>
            <h1>${escapeHtml(page.title)}</h1>
            <p>${escapeHtml(page.summary)}</p>
            <div class="cta">
              <a class="button" href="https://wa.me/66618016793">Ask on WhatsApp</a>
              <a class="button" href="https://t.me/fast_track_phuket">Ask on Telegram</a>
            </div>
          </div>
          <img src="/hkt-airport.png" alt="${escapeHtml(page.title)}" width="640" height="640" fetchpriority="high" decoding="async" />
        </header>

        <section class="fact-grid" aria-label="Guide topics">
${page.keywords.map((keyword) => `          <div class="fact">${escapeHtml(keyword)}</div>`).join('\n')}
        </section>

${renderLicenseNotice(englishLocale)}

${page.sections.map((section) => `        <section>
          <h2>${escapeHtml(section.heading)}</h2>
${section.paragraphs.map((paragraph) => `          <p>${escapeHtml(paragraph)}</p>`).join('\n')}
        </section>`).join('\n\n')}

        <section>
          <h2>Common Questions</h2>
${page.faq.map((item) => `          <article>
            <h3>${escapeHtml(item.q)}</h3>
            <p>${escapeHtml(item.a)}</p>
          </article>`).join('\n')}
        </section>

        <section>
          <h2>Related Fast Track Pages</h2>
          <div class="cards">
            <article class="card">
              <h3><a href="/arrival-fast-track/">Arrival Fast Track</a></h3>
              <p>Meet-and-assist for international arrivals at Phuket Airport.</p>
            </article>
            <article class="card">
              <h3><a href="/departure-vip/">Departure VIP</a></h3>
              <p>Terminal entrance meeting, passport-control guidance, and gate escort.</p>
            </article>
            <article class="card">
              <h3><a href="/phuket-airport-fast-track-prices/">Prices</a></h3>
              <p>Current price anchors for arrival, departure, combo, children, and infants.</p>
            </article>
            <article class="card">
              <h3><a href="/tdac-guide/">TDAC Guide</a></h3>
              <p>Thailand Digital Arrival Card information for HKT travelers.</p>
            </article>
          </div>
        </section>
      </article>
    </main>
    <footer>
      <p>VIP Fast Track Phuket Airport (HKT) · 222 Mai Khao, Thalang District, Phuket 83110, Thailand · <a href="/blog/">All guides</a> · <a href="/ai.txt">AI permissions</a> · <a href="/sitemap.xml">Sitemap</a></p>
    </footer>
  </body>
</html>
`;
};

const imageBlock = (loc) => `    <image:image>
      <image:loc>${escapeXml(loc)}</image:loc>
    </image:image>`;

const renderSitemap = () => {
  const homeEntries = languages.map((language) => `  <url>
    <loc>${languageUrl(language.code)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${language.code === 'en' ? '1.0' : '0.95'}</priority>
${alternateLinksXml()}
${imageBlock(HERO_IMAGE)}
  </url>`);

  const supportingEntries = supportingUrls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.loc.endsWith('/') ? `\n${imageBlock(HERO_IMAGE)}` : ''}
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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

const blogDir = path.join(publicDir, 'blog');
fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(path.join(blogDir, 'index.html'), renderBlogIndexPage());

for (const page of blogPages) {
  const outputDir = path.join(blogDir, page.slug);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderBlogPage(page));
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), renderSitemap());

console.log(`Generated ${languages.length - 1} localized SEO pages, ${blogPages.length + 1} guide pages, and sitemap.xml`);
