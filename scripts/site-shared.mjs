// Single source of truth for business facts, languages, and pricing used by
// every generator (SEO pages, app language pages, AI context files, sitemap).
// Editing a fact here propagates to all generated HTML, JSON-LD, and AI files
// on the next build — do not restate these values inside generators.

export const BASE_URL = 'https://fast-track-phuket.com';

export const BUSINESS = {
  name: 'VIP Fast Track Phuket Airport (HKT)',
  alternateName: 'Fast Track Phuket',
  description: 'VIP meet-and-assist airport service at Phuket International Airport (HKT). Operating since 2013, providing personal escort through immigration and customs in under 5 minutes.',
  foundingYear: '2013',
  telephone: '+66 6-1801-6793',
  phoneHref: 'tel:+66618016793',
  whatsappUrl: 'https://wa.me/66618016793',
  telegramUrl: 'https://t.me/fast_track_phuket',
  telegramHandle: '@fast_track_phuket',
  email: null,
  address: {
    streetAddress: '222 Mai Khao, Thalang District',
    addressLocality: 'Phuket',
    addressRegion: 'Phuket',
    postalCode: '83110',
    addressCountry: 'TH',
  },
  geo: { latitude: 8.1132, longitude: 98.3169 },
  airport: { name: 'Phuket International Airport', iataCode: 'HKT' },
  // The service runs around the clock for all international flights;
  // keep this the only statement of operating hours anywhere.
  hours: { opens: '00:00', closes: '23:59', text: '24/7' },
  logoUrl: `${BASE_URL}/icon-512.png`,
  imageUrl: `${BASE_URL}/hkt-airport.png`,
  ogImageUrl: `${BASE_URL}/og-image.png`,
  sameAs: [
    'https://t.me/fast_track_phuket',
    'https://wa.me/66618016793',
  ],
  paymentAccepted: 'Thai QR, Credit Card, Debit Card, Cash, Bank Transfer, Cryptocurrency (USDT/USDC)',
  currenciesAccepted: 'THB, RUB, USD',
  // Verifiable positioning only: licensed + independent. Never claim airport
  // or government affiliation in generated copy (see ai.txt restrictions).
  licensing: 'Independent TAT/DOT-licensed tourism service provider; the license certificate is displayed on the homepage.',
};

export const languages = [
  { code: 'en', htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US', name: 'English' },
  { code: 'ru', htmlLang: 'ru', dir: 'ltr', ogLocale: 'ru_RU', name: 'Russian' },
  { code: 'zh', htmlLang: 'zh', dir: 'ltr', ogLocale: 'zh_CN', name: 'Chinese' },
  { code: 'hi', htmlLang: 'hi', dir: 'ltr', ogLocale: 'hi_IN', name: 'Hindi' },
  { code: 'he', htmlLang: 'he', dir: 'rtl', ogLocale: 'he_IL', name: 'Hebrew' },
  { code: 'ar', htmlLang: 'ar', dir: 'rtl', ogLocale: 'ar_AE', name: 'Arabic' },
  { code: 'es', htmlLang: 'es', dir: 'ltr', ogLocale: 'es_ES', name: 'Spanish' },
  { code: 'fr', htmlLang: 'fr', dir: 'ltr', ogLocale: 'fr_FR', name: 'French' },
  { code: 'de', htmlLang: 'de', dir: 'ltr', ogLocale: 'de_DE', name: 'German' },
  { code: 'it', htmlLang: 'it', dir: 'ltr', ogLocale: 'it_IT', name: 'Italian' },
];

export const thbPrices = {
  arr: { adult: 1900, child: 900 },
  dep: { adult: 1900, child: 900 },
  combo: { adult: 3600, child: 1800 },
};

export const thbToRubRate = 2.33299;

export const faqItemIndexes = [1, 3, 4, 6];

export const priceCurrencyFor = (languageCode) => languageCode === 'ru' ? 'RUB' : 'THB';

export const roundedLocalizedAmount = (thbAmount, languageCode) => (
  languageCode === 'ru' ? Math.round((thbAmount * thbToRubRate) / 100) * 100 : thbAmount
);

export const formatLocalizedPrice = (thbAmount, languageCode = 'en') => {
  if (languageCode === 'ru') {
    return `${new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 0,
    }).format(roundedLocalizedAmount(thbAmount, languageCode))} ₽`;
  }

  return `THB ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(thbAmount)}`;
};

export const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const splitList = (value) => String(value || '').split('|').filter(Boolean);

export const languageUrl = (code) => code === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${code}/`;

// JSON-LD node for the business, referenced by @id from every page's graph.
// aggregateRating is intentionally absent: Google treats self-serving review
// markup on LocalBusiness as spam and there is no third-party review source yet.
export const localBusinessNode = () => ({
  // TravelAgency is the closest LocalBusiness subtype for a licensed tourism
  // service provider; Google asks for the most specific applicable subtype.
  '@type': ['TravelAgency', 'LocalBusiness'],
  '@id': `${BASE_URL}/#business`,
  name: BUSINESS.name,
  alternateName: BUSINESS.alternateName,
  legalName: 'ILVES TOUR CO., LTD.',
  identifier: [
    {
      '@type': 'PropertyValue',
      name: 'Thailand Tourism Business License (TAT)',
      value: '11/07698',
    },
    {
      '@type': 'PropertyValue',
      name: 'Thailand Juristic Person Registration',
      value: '0205539002570',
    },
  ],
  description: BUSINESS.description,
  url: `${BASE_URL}/`,
  image: BUSINESS.imageUrl,
  logo: {
    '@type': 'ImageObject',
    url: BUSINESS.logoUrl,
    width: 512,
    height: 512,
  },
  telephone: BUSINESS.telephone,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BUSINESS.telephone,
    contactType: 'customer service',
    areaServed: 'TH',
    availableLanguage: languages.map((language) => language.name),
  },
  foundingDate: BUSINESS.foundingYear,
  priceRange: '฿1,900–฿3,600',
  currenciesAccepted: BUSINESS.currenciesAccepted,
  paymentAccepted: BUSINESS.paymentAccepted,
  sameAs: BUSINESS.sameAs,
  address: { '@type': 'PostalAddress', ...BUSINESS.address },
  geo: { '@type': 'GeoCoordinates', ...BUSINESS.geo },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: BUSINESS.hours.opens,
    closes: BUSINESS.hours.closes,
  }],
  areaServed: {
    '@type': 'Airport',
    name: BUSINESS.airport.name,
    iataCode: BUSINESS.airport.iataCode,
  },
  knowsLanguage: languages.map((language) => language.htmlLang).concat('th'),
});

export const webSiteNode = () => ({
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: BUSINESS.name,
  inLanguage: languages.map((language) => language.htmlLang),
  publisher: { '@id': `${BASE_URL}/#business` },
});

export const serializeJsonLd = (value) => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');
