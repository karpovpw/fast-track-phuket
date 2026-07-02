import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE_URL = 'https://fast-track-phuket.com';
// Sitemap lastmod / dateModified track the actual build so freshness is honest;
// datePublished stays fixed so guide articles keep a stable original publish date.
const LASTMOD = new Date().toISOString().slice(0, 10);
const PUBLISHED = '2026-06-05';
const HERO_IMAGE = `${BASE_URL}/hkt-airport.png`;
const FEED_URL = `${BASE_URL}/feed.xml`;

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
  arr: { adult: 1900, child: 900 },
  dep: { adult: 1900, child: 900 },
  combo: { adult: 3600, child: 1800 },
};

const thbToRubRate = 2.33299;
const faqItemIndexes = [1, 3, 4, 6];

const priceCurrencyFor = (languageCode) => languageCode === 'ru' ? 'RUB' : 'THB';

const roundedLocalizedAmount = (thbAmount, languageCode) => (
  languageCode === 'ru' ? Math.round((thbAmount * thbToRubRate) / 100) * 100 : thbAmount
);

const formatLocalizedPrice = (thbAmount, languageCode = 'en') => {
  if (languageCode === 'ru') {
    return `${new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 0,
    }).format(roundedLocalizedAmount(thbAmount, languageCode))} ₽`;
  }

  return `THB ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(thbAmount)}`;
};

const p = (packageCode, priceType) => formatLocalizedPrice(thbPrices[packageCode][priceType]);

const blogPages = [
  {
    key: 'complete',
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
          `Arrival Fast Track is ${p('arr', 'adult')} per adult passenger. Departure VIP is ${p('dep', 'adult')} per adult passenger. The arrival plus departure combo is ${p('combo', 'adult')} per adult passenger.`,
          `Children under 12 are ${p('arr', 'child')} for one-way services and ${p('combo', 'child')} for the combo. Infants from 0 to 2 years are free. For travelers who need both landing and return-flight assistance, the combo is usually the simplest booking because it combines both airport directions and support in one conversation.`,
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
        q: 'Does VIP Fast Track guarantee immigration approval?',
        a: 'No. Immigration decisions remain with Thai authorities. Fast Track provides meet-and-assist guidance through the airport process.',
      },
    ],
  },
  {
    key: 'arrival',
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
    key: 'departure',
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
          `Departure VIP is ${p('dep', 'adult')} per adult passenger. Children under 12 are ${p('dep', 'child')} and infants from 0 to 2 years are free.`,
          `Travelers booking both arrival and departure should compare the combo package, which is ${p('combo', 'adult')} per adult passenger.`,
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
    key: 'prices',
    slug: 'phuket-airport-fast-track-prices-worth-it',
    title: 'Is VIP Fast Track Phuket Airport (HKT) Worth It? Prices and Use Cases',
    description: 'Compare VIP Fast Track Phuket Airport (HKT) prices with regular HKT immigration and learn when VIP meet-and-assist is worth booking for arrivals, departures, families, and groups.',
    summary: 'Fast Track is worth it when time, certainty, family comfort, or airport support matters more than the lowest possible transfer cost.',
    keywords: ['Phuket fast track price', 'Phuket airport fast track worth it', 'HKT VIP price'],
    sections: [
      {
        heading: 'Current price anchors',
        paragraphs: [
          `The main price anchors are ${p('arr', 'adult')} per adult passenger for Arrival Fast Track, ${p('dep', 'adult')} per adult passenger for Departure VIP, and ${p('combo', 'adult')} per adult passenger for the arrival plus departure combo.`,
          `Children under 12 are ${p('arr', 'child')} for one-way services and ${p('combo', 'child')} for the combo. Infants from 0 to 2 years are free.`,
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
          'For families and groups, the published per-passenger rates make the final quote easier to calculate before booking.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the cheapest VIP Fast Track Phuket Airport (HKT) option?',
        a: `Arrival Fast Track is ${p('arr', 'adult')} per adult passenger.`,
      },
      {
        q: 'Is Fast Track worth it for families?',
        a: 'It is often worth it for families because children, luggage, and long-haul fatigue make airport uncertainty more expensive in practice.',
      },
      {
        q: 'Is the combo cheaper than booking arrival and departure separately?',
        a: `The combo is ${p('combo', 'adult')} per adult passenger and is usually the simplest option for travelers who need both directions.`,
      },
    ],
  },
  {
    key: 'peak-season',
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
    key: 'tdac',
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

const blogUiByLanguage = {
  en: {
    home: 'Home',
    hubShort: 'Guides',
    hubTitle: 'VIP Fast Track Phuket Airport (HKT) Guides',
    hubDescription: 'Guides for VIP Fast Track Phuket Airport (HKT), arrival immigration, departure VIP service, HKT prices, TDAC, peak-season airport planning, and VIP meet-and-assist.',
    hubIntro: 'Practical, crawlable guidance for travelers comparing VIP Fast Track, regular immigration, TDAC preparation, departure support, and Phuket Airport peak-season planning.',
    allGuides: 'All Guides',
    guideKicker: 'VIP Fast Track Phuket Airport (HKT) guide',
    updated: 'Updated',
    bookWhatsApp: 'Book on WhatsApp',
    bookTelegram: 'Book on Telegram',
    askWhatsApp: 'Ask on WhatsApp',
    askTelegram: 'Ask on Telegram',
    aiSummary: 'AI summary',
    relatedTitle: 'Related Fast Track Pages',
    commonQuestions: 'Common Questions',
    completeGuide: 'Complete 2026 Guide',
    guideSuffix: 'Guide',
    valueGuide: 'Prices and Use Cases',
    peakTitle: 'Phuket Airport Peak Season Immigration Tips',
    tdacBridgeTitle: 'TDAC and VIP Fast Track Phuket Airport (HKT) Guide',
    serviceOverview: 'Service overview',
    pricePlanning: 'Prices and planning',
    airportFlow: 'Airport flow',
    bookingPrep: 'Booking preparation',
    contactLine: 'For a booking check, send the flight number, passenger names, service direction, and preferred contact channel.',
    relatedArrival: 'Meet-and-assist for international arrivals at Phuket Airport.',
    relatedDeparture: 'Terminal entrance meeting, passport-control guidance, and gate escort.',
    relatedPrices: 'Current price anchors for arrival, departure, combo, children, and infants.',
    relatedTdac: 'Thailand Digital Arrival Card information for HKT travelers.',
  },
  ru: {
    home: 'Главная',
    hubShort: 'Гайды',
    hubTitle: 'Гайды по VIP Fast Track в аэропорту Пхукета (HKT)',
    hubDescription: 'Гайды по VIP Fast Track в аэропорту Пхукета: прилет, вылет, цены, TDAC, высокий сезон и планирование прохождения иммиграции.',
    hubIntro: 'Практичные материалы для путешественников, которые сравнивают VIP Fast Track, обычную очередь, подготовку TDAC, сопровождение на вылет и высокий сезон в HKT.',
    allGuides: 'Все гайды',
    guideKicker: 'Гайд VIP Fast Track Phuket Airport (HKT)',
    updated: 'Обновлено',
    bookWhatsApp: 'Забронировать в WhatsApp',
    bookTelegram: 'Забронировать в Telegram',
    askWhatsApp: 'Спросить в WhatsApp',
    askTelegram: 'Спросить в Telegram',
    aiSummary: 'AI-сводка',
    relatedTitle: 'Связанные страницы Fast Track',
    commonQuestions: 'Частые вопросы',
    completeGuide: 'Полный гид 2026',
    guideSuffix: 'Гайд',
    valueGuide: 'Цены и сценарии',
    peakTitle: 'Советы для высокого сезона в аэропорту Пхукета',
    tdacBridgeTitle: 'TDAC и VIP Fast Track в аэропорту Пхукета (HKT)',
    serviceOverview: 'Обзор услуги',
    pricePlanning: 'Цены и планирование',
    airportFlow: 'Маршрут в аэропорту',
    bookingPrep: 'Подготовка к бронированию',
    contactLine: 'Для проверки бронирования отправьте номер рейса, имена пассажиров, направление услуги и удобный канал связи.',
    relatedArrival: 'Сопровождение для международного прилета в аэропорту Пхукета.',
    relatedDeparture: 'Встреча у терминала, помощь на паспортном контроле и сопровождение к выходу.',
    relatedPrices: 'Актуальные цены на прилет, вылет, комбо, детей и младенцев.',
    relatedTdac: 'Информация о Thailand Digital Arrival Card для пассажиров HKT.',
  },
  zh: {
    home: '首页',
    hubShort: '指南',
    hubTitle: '普吉机场 (HKT) VIP Fast Track 指南',
    hubDescription: '普吉机场 VIP Fast Track 指南：抵达入境、离境 VIP 服务、价格、TDAC、高峰季和 HKT 入境规划。',
    hubIntro: '为旅客比较 VIP Fast Track、普通入境排队、TDAC 准备、离境协助和普吉机场高峰季规划提供实用说明。',
    allGuides: '全部指南',
    guideKicker: '普吉机场 (HKT) VIP Fast Track 指南',
    updated: '更新于',
    bookWhatsApp: '通过 WhatsApp 预订',
    bookTelegram: '通过 Telegram 预订',
    askWhatsApp: '在 WhatsApp 咨询',
    askTelegram: '在 Telegram 咨询',
    aiSummary: 'AI 摘要',
    relatedTitle: '相关 Fast Track 页面',
    commonQuestions: '常见问题',
    completeGuide: '2026 完整指南',
    guideSuffix: '指南',
    valueGuide: '价格和适用场景',
    peakTitle: '普吉机场高峰季入境建议',
    tdacBridgeTitle: 'TDAC 与普吉机场 (HKT) VIP Fast Track 指南',
    serviceOverview: '服务概览',
    pricePlanning: '价格与规划',
    airportFlow: '机场流程',
    bookingPrep: '预订准备',
    contactLine: '确认预订时，请发送航班号、乘客姓名、服务方向和首选联系方式。',
    relatedArrival: '普吉机场国际抵达旅客的专人迎接与协助。',
    relatedDeparture: '航站楼入口会合、护照检查指引和登机口陪同。',
    relatedPrices: '抵达、离境、组合、儿童和婴儿的当前价格参考。',
    relatedTdac: '面向 HKT 旅客的 Thailand Digital Arrival Card 信息。',
  },
  hi: {
    home: 'होम',
    hubShort: 'गाइड',
    hubTitle: 'फुकेत एयरपोर्ट (HKT) VIP Fast Track गाइड',
    hubDescription: 'फुकेत एयरपोर्ट VIP Fast Track गाइड: आगमन इमिग्रेशन, प्रस्थान VIP सेवा, कीमतें, TDAC, पीक सीजन और HKT एयरपोर्ट प्लानिंग.',
    hubIntro: 'VIP Fast Track, सामान्य इमिग्रेशन, TDAC तैयारी, प्रस्थान सहायता और फुकेत एयरपोर्ट पीक सीजन की तुलना कर रहे यात्रियों के लिए व्यावहारिक जानकारी.',
    allGuides: 'सभी गाइड',
    guideKicker: 'VIP Fast Track Phuket Airport (HKT) गाइड',
    updated: 'अपडेट',
    bookWhatsApp: 'WhatsApp पर बुक करें',
    bookTelegram: 'Telegram पर बुक करें',
    askWhatsApp: 'WhatsApp पर पूछें',
    askTelegram: 'Telegram पर पूछें',
    aiSummary: 'AI सारांश',
    relatedTitle: 'संबंधित Fast Track पेज',
    commonQuestions: 'सामान्य प्रश्न',
    completeGuide: 'पूर्ण 2026 गाइड',
    guideSuffix: 'गाइड',
    valueGuide: 'कीमतें और उपयोग',
    peakTitle: 'फुकेत एयरपोर्ट पीक सीजन इमिग्रेशन टिप्स',
    tdacBridgeTitle: 'TDAC और फुकेत एयरपोर्ट (HKT) VIP Fast Track गाइड',
    serviceOverview: 'सेवा परिचय',
    pricePlanning: 'कीमतें और योजना',
    airportFlow: 'एयरपोर्ट प्रक्रिया',
    bookingPrep: 'बुकिंग तैयारी',
    contactLine: 'बुकिंग जांच के लिए उड़ान संख्या, यात्रियों के नाम, सेवा दिशा और पसंदीदा संपर्क चैनल भेजें.',
    relatedArrival: 'फुकेत एयरपोर्ट पर अंतरराष्ट्रीय आगमन के लिए meet-and-assist.',
    relatedDeparture: 'टर्मिनल प्रवेश पर मुलाकात, पासपोर्ट नियंत्रण मार्गदर्शन और गेट एस्कॉर्ट.',
    relatedPrices: 'आगमन, प्रस्थान, कॉम्बो, बच्चों और शिशुओं की वर्तमान कीमतें.',
    relatedTdac: 'HKT यात्रियों के लिए Thailand Digital Arrival Card जानकारी.',
  },
  he: {
    home: 'בית',
    hubShort: 'מדריכים',
    hubTitle: 'מדריכי VIP Fast Track לנמל התעופה פוקט (HKT)',
    hubDescription: 'מדריכים ל-VIP Fast Track בנמל התעופה פוקט: הגעה, יציאה, מחירים, TDAC, עונת שיא ותכנון מעבר ב-HKT.',
    hubIntro: 'מידע מעשי לנוסעים שמשווים בין VIP Fast Track, תור רגיל, הכנת TDAC, סיוע ביציאה ותכנון בעונת השיא בפוקט.',
    allGuides: 'כל המדריכים',
    guideKicker: 'מדריך VIP Fast Track Phuket Airport (HKT)',
    updated: 'עודכן',
    bookWhatsApp: 'הזמנה ב-WhatsApp',
    bookTelegram: 'הזמנה ב-Telegram',
    askWhatsApp: 'שאלה ב-WhatsApp',
    askTelegram: 'שאלה ב-Telegram',
    aiSummary: 'תקציר AI',
    relatedTitle: 'עמודי Fast Track קשורים',
    commonQuestions: 'שאלות נפוצות',
    completeGuide: 'מדריך מלא 2026',
    guideSuffix: 'מדריך',
    valueGuide: 'מחירים ומקרי שימוש',
    peakTitle: 'טיפים לעונת השיא בנמל התעופה פוקט',
    tdacBridgeTitle: 'TDAC ו-VIP Fast Track בנמל התעופה פוקט (HKT)',
    serviceOverview: 'סקירת השירות',
    pricePlanning: 'מחירים ותכנון',
    airportFlow: 'תהליך בנמל התעופה',
    bookingPrep: 'הכנה להזמנה',
    contactLine: 'לבדיקת הזמנה שלחו מספר טיסה, שמות נוסעים, כיוון השירות וערוץ קשר מועדף.',
    relatedArrival: 'סיוע אישי לנוסעים בינלאומיים הנוחתים בפוקט.',
    relatedDeparture: 'מפגש בכניסה לטרמינל, הכוונה בביקורת דרכונים וליווי לשער.',
    relatedPrices: 'מחירי הגעה, יציאה, קומבו, ילדים ותינוקות.',
    relatedTdac: 'מידע על Thailand Digital Arrival Card לנוסעי HKT.',
  },
  ar: {
    home: 'الرئيسية',
    hubShort: 'الأدلة',
    hubTitle: 'أدلة VIP Fast Track في مطار بوكيت (HKT)',
    hubDescription: 'أدلة VIP Fast Track في مطار بوكيت: الوصول، المغادرة، الأسعار، TDAC، موسم الذروة وتخطيط إجراءات HKT.',
    hubIntro: 'معلومات عملية للمسافرين الذين يقارنون بين VIP Fast Track، طوابير الهجرة العادية، تجهيز TDAC، دعم المغادرة وموسم الذروة في مطار بوكيت.',
    allGuides: 'كل الأدلة',
    guideKicker: 'دليل VIP Fast Track Phuket Airport (HKT)',
    updated: 'تم التحديث',
    bookWhatsApp: 'احجز عبر WhatsApp',
    bookTelegram: 'احجز عبر Telegram',
    askWhatsApp: 'اسأل عبر WhatsApp',
    askTelegram: 'اسأل عبر Telegram',
    aiSummary: 'ملخص AI',
    relatedTitle: 'صفحات Fast Track ذات صلة',
    commonQuestions: 'الأسئلة الشائعة',
    completeGuide: 'الدليل الكامل 2026',
    guideSuffix: 'دليل',
    valueGuide: 'الأسعار وحالات الاستخدام',
    peakTitle: 'نصائح موسم الذروة في مطار بوكيت',
    tdacBridgeTitle: 'TDAC و VIP Fast Track في مطار بوكيت (HKT)',
    serviceOverview: 'نظرة عامة على الخدمة',
    pricePlanning: 'الأسعار والتخطيط',
    airportFlow: 'مسار المطار',
    bookingPrep: 'التحضير للحجز',
    contactLine: 'لفحص الحجز، أرسل رقم الرحلة وأسماء الركاب واتجاه الخدمة وقناة التواصل المفضلة.',
    relatedArrival: 'استقبال ومساعدة للقادمين الدوليين في مطار بوكيت.',
    relatedDeparture: 'لقاء عند مدخل المبنى، إرشاد في مراقبة الجوازات ومرافقة إلى البوابة.',
    relatedPrices: 'أسعار الوصول والمغادرة والباقة والأطفال والرضع.',
    relatedTdac: 'معلومات Thailand Digital Arrival Card لمسافري HKT.',
  },
  es: {
    home: 'Inicio',
    hubShort: 'Guías',
    hubTitle: 'Guías VIP Fast Track del Aeropuerto de Phuket (HKT)',
    hubDescription: 'Guías de VIP Fast Track en el Aeropuerto de Phuket: llegada, salida VIP, precios, TDAC, temporada alta y planificación de inmigración en HKT.',
    hubIntro: 'Información práctica para viajeros que comparan VIP Fast Track, inmigración normal, preparación de TDAC, asistencia de salida y temporada alta en Phuket.',
    allGuides: 'Todas las guías',
    guideKicker: 'Guía VIP Fast Track Phuket Airport (HKT)',
    updated: 'Actualizado',
    bookWhatsApp: 'Reservar por WhatsApp',
    bookTelegram: 'Reservar por Telegram',
    askWhatsApp: 'Preguntar por WhatsApp',
    askTelegram: 'Preguntar por Telegram',
    aiSummary: 'Resumen AI',
    relatedTitle: 'Páginas Fast Track relacionadas',
    commonQuestions: 'Preguntas frecuentes',
    completeGuide: 'Guía completa 2026',
    guideSuffix: 'Guía',
    valueGuide: 'Precios y casos de uso',
    peakTitle: 'Consejos de inmigración para temporada alta en Phuket Airport',
    tdacBridgeTitle: 'Guía TDAC y VIP Fast Track Phuket Airport (HKT)',
    serviceOverview: 'Resumen del servicio',
    pricePlanning: 'Precios y planificación',
    airportFlow: 'Flujo en el aeropuerto',
    bookingPrep: 'Preparación de la reserva',
    contactLine: 'Para revisar una reserva, envía número de vuelo, nombres de pasajeros, dirección del servicio y canal de contacto preferido.',
    relatedArrival: 'Meet-and-assist para llegadas internacionales al Aeropuerto de Phuket.',
    relatedDeparture: 'Encuentro en la entrada de la terminal, guía en control de pasaportes y escolta a la puerta.',
    relatedPrices: 'Precios actuales para llegada, salida, combo, niños y bebés.',
    relatedTdac: 'Información de Thailand Digital Arrival Card para viajeros de HKT.',
  },
  fr: {
    home: 'Accueil',
    hubShort: 'Guides',
    hubTitle: 'Guides VIP Fast Track de l’aéroport de Phuket (HKT)',
    hubDescription: 'Guides VIP Fast Track à l’aéroport de Phuket : arrivée, départ VIP, prix, TDAC, haute saison et organisation de l’immigration à HKT.',
    hubIntro: 'Conseils pratiques pour comparer VIP Fast Track, immigration standard, préparation TDAC, assistance au départ et haute saison à Phuket.',
    allGuides: 'Tous les guides',
    guideKicker: 'Guide VIP Fast Track Phuket Airport (HKT)',
    updated: 'Mis à jour',
    bookWhatsApp: 'Réserver sur WhatsApp',
    bookTelegram: 'Réserver sur Telegram',
    askWhatsApp: 'Question sur WhatsApp',
    askTelegram: 'Question sur Telegram',
    aiSummary: 'Résumé AI',
    relatedTitle: 'Pages Fast Track associées',
    commonQuestions: 'Questions fréquentes',
    completeGuide: 'Guide complet 2026',
    guideSuffix: 'Guide',
    valueGuide: 'Prix et cas d’usage',
    peakTitle: 'Conseils immigration en haute saison à Phuket Airport',
    tdacBridgeTitle: 'Guide TDAC et VIP Fast Track Phuket Airport (HKT)',
    serviceOverview: 'Aperçu du service',
    pricePlanning: 'Prix et planification',
    airportFlow: 'Parcours à l’aéroport',
    bookingPrep: 'Préparation de la réservation',
    contactLine: 'Pour vérifier une réservation, envoyez le numéro de vol, les noms des passagers, le sens du service et le canal de contact préféré.',
    relatedArrival: 'Accueil et assistance pour les arrivées internationales à Phuket Airport.',
    relatedDeparture: 'Rendez-vous à l’entrée du terminal, guidage au contrôle des passeports et accompagnement à la porte.',
    relatedPrices: 'Prix actuels pour arrivée, départ, combo, enfants et bébés.',
    relatedTdac: 'Informations Thailand Digital Arrival Card pour les voyageurs HKT.',
  },
  de: {
    home: 'Start',
    hubShort: 'Guides',
    hubTitle: 'VIP Fast Track Guides für Phuket Airport (HKT)',
    hubDescription: 'Guides für VIP Fast Track am Flughafen Phuket: Ankunft, Departure VIP, Preise, TDAC, Hochsaison und HKT-Immigrationsplanung.',
    hubIntro: 'Praktische Informationen für Reisende, die VIP Fast Track, normale Immigration, TDAC-Vorbereitung, Abflugassistenz und Hochsaison in Phuket vergleichen.',
    allGuides: 'Alle Guides',
    guideKicker: 'VIP Fast Track Phuket Airport (HKT) Guide',
    updated: 'Aktualisiert',
    bookWhatsApp: 'Per WhatsApp buchen',
    bookTelegram: 'Per Telegram buchen',
    askWhatsApp: 'Per WhatsApp fragen',
    askTelegram: 'Per Telegram fragen',
    aiSummary: 'AI-Zusammenfassung',
    relatedTitle: 'Verwandte Fast Track Seiten',
    commonQuestions: 'Häufige Fragen',
    completeGuide: 'Kompletter Guide 2026',
    guideSuffix: 'Guide',
    valueGuide: 'Preise und Anwendungsfälle',
    peakTitle: 'Immigrationstipps für die Hochsaison am Flughafen Phuket',
    tdacBridgeTitle: 'TDAC und VIP Fast Track Phuket Airport (HKT) Guide',
    serviceOverview: 'Serviceüberblick',
    pricePlanning: 'Preise und Planung',
    airportFlow: 'Ablauf am Flughafen',
    bookingPrep: 'Buchungsvorbereitung',
    contactLine: 'Senden Sie für eine Buchungsprüfung Flugnummer, Passagiernamen, Servicerichtung und bevorzugten Kontaktkanal.',
    relatedArrival: 'Meet-and-assist für internationale Ankünfte am Flughafen Phuket.',
    relatedDeparture: 'Treffen am Terminaleingang, Passkontrollführung und Gate-Begleitung.',
    relatedPrices: 'Aktuelle Preise für Ankunft, Abflug, Combo, Kinder und Kleinkinder.',
    relatedTdac: 'Informationen zur Thailand Digital Arrival Card für HKT-Reisende.',
  },
  it: {
    home: 'Home',
    hubShort: 'Guide',
    hubTitle: 'Guide VIP Fast Track Aeroporto di Phuket (HKT)',
    hubDescription: 'Guide VIP Fast Track per l’aeroporto di Phuket: arrivo, partenza VIP, prezzi, TDAC, alta stagione e pianificazione immigrazione HKT.',
    hubIntro: 'Informazioni pratiche per chi confronta VIP Fast Track, immigrazione standard, preparazione TDAC, assistenza alla partenza e alta stagione a Phuket.',
    allGuides: 'Tutte le guide',
    guideKicker: 'Guida VIP Fast Track Phuket Airport (HKT)',
    updated: 'Aggiornato',
    bookWhatsApp: 'Prenota su WhatsApp',
    bookTelegram: 'Prenota su Telegram',
    askWhatsApp: 'Chiedi su WhatsApp',
    askTelegram: 'Chiedi su Telegram',
    aiSummary: 'Riepilogo AI',
    relatedTitle: 'Pagine Fast Track correlate',
    commonQuestions: 'Domande frequenti',
    completeGuide: 'Guida completa 2026',
    guideSuffix: 'Guida',
    valueGuide: 'Prezzi e casi d’uso',
    peakTitle: 'Consigli immigrazione per alta stagione a Phuket Airport',
    tdacBridgeTitle: 'Guida TDAC e VIP Fast Track Phuket Airport (HKT)',
    serviceOverview: 'Panoramica del servizio',
    pricePlanning: 'Prezzi e pianificazione',
    airportFlow: 'Flusso in aeroporto',
    bookingPrep: 'Preparazione della prenotazione',
    contactLine: 'Per verificare una prenotazione, invia numero di volo, nomi dei passeggeri, direzione del servizio e canale di contatto preferito.',
    relatedArrival: 'Meet-and-assist per arrivi internazionali all’aeroporto di Phuket.',
    relatedDeparture: 'Incontro all’ingresso del terminal, guida al controllo passaporti e accompagnamento al gate.',
    relatedPrices: 'Prezzi attuali per arrivo, partenza, combo, bambini e neonati.',
    relatedTdac: 'Informazioni Thailand Digital Arrival Card per viaggiatori HKT.',
  },
};

const blogUiFor = (languageCode) => blogUiByLanguage[languageCode] || blogUiByLanguage.en;

const cleanText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const metaDescription = (...parts) => {
  const text = cleanText(parts.filter(Boolean).join(' '));
  return text.length > 300 ? `${text.slice(0, 297).trim()}...` : text;
};

const removeLineBreakMarker = (value) => String(value || '').replaceAll('|', ' ');

const packageFeatureText = (t, packageCode) => {
  const features = splitList(t[`packages.${packageCode}.features`]).slice(0, 4).join('. ');
  return cleanText(`${t[`packages.${packageCode}.title`]}: ${t[`packages.${packageCode}.desc`]} ${features}.`);
};

const oneWayPriceText = (t, languageCode, packageCode) => {
  const packagePrice = thbPrices[packageCode];
  return cleanText(`${t[`packages.${packageCode}.title`]}: ${formatLocalizedPrice(packagePrice.adult, languageCode)} ${removeLineBreakMarker(t['packages.th2'])}; ${removeLineBreakMarker(t['packages.th4'])}: ${formatLocalizedPrice(packagePrice.child, languageCode)}; ${removeLineBreakMarker(t['packages.th5'])}: ${t['packages.price.infant']}.`);
};

const comboPriceText = (t, languageCode) => cleanText(`${t['packages.combo.title']}: ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)} ${removeLineBreakMarker(t['packages.th2'])}; ${removeLineBreakMarker(t['packages.th4'])}: ${formatLocalizedPrice(thbPrices.combo.child, languageCode)}; ${removeLineBreakMarker(t['packages.th5'])}: ${t['packages.price.infant']}.`);

const localizedFaq = (t, indexes) => indexes.map((index) => ({
  q: t[`faq.${index}.q`],
  a: t[`faq.${index}.a`],
}));

const buildLocalizedBlogPage = (page, language, t) => {
  if (language.code === 'en') return page;

  const ui = blogUiFor(language.code);
  const serviceOverview = [
    t['hero.subtitle'],
    [packageFeatureText(t, 'arr'), packageFeatureText(t, 'dep'), packageFeatureText(t, 'combo')].join(' '),
  ];
  const pricePlanning = [
    [oneWayPriceText(t, language.code, 'arr'), oneWayPriceText(t, language.code, 'dep'), comboPriceText(t, language.code)].join(' '),
    cleanText(`${t['packages.footer']} ${t['takeaways.5']}`),
  ];
  const airportFlow = [
    t['meeting.desc'],
    cleanText(`${t['compare.f1']}: ${t['compare.r1.1']} / ${t['compare.r1.2']}. ${t['compare.f2']}: ${t['compare.r2.2']}.`),
  ];
  const bookingPrep = [
    cleanText(`${t['meeting.order.1.before']}${t['meeting.order.1.strong']}${t['meeting.order.1.after']} ${t['meeting.order.2']} ${t['meeting.order.3']}`),
    ui.contactLine,
  ];
  const tdacPlanning = [
    t['guides.tdac.d'],
    cleanText(`${t['faq.4.q']} ${t['faq.4.a']}`),
  ];

  const topicContent = {
    complete: {
      title: `${t['hero.title']} | ${ui.completeGuide}`,
      summary: metaDescription(t['hero.subtitle'], t['pkg_section.subtitle']),
      sections: [
        { heading: ui.serviceOverview, paragraphs: serviceOverview },
        { heading: ui.pricePlanning, paragraphs: pricePlanning },
        { heading: ui.airportFlow, paragraphs: airportFlow },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [1, 3, 4, 6]),
    },
    arrival: {
      title: `${t['packages.arr.title']} | ${ui.guideSuffix}`,
      summary: metaDescription(t['packages.arr.desc'], t['meeting.desc']),
      sections: [
        { heading: ui.serviceOverview, paragraphs: [packageFeatureText(t, 'arr'), t['hero.subtitle']] },
        { heading: ui.airportFlow, paragraphs: airportFlow },
        { heading: ui.pricePlanning, paragraphs: [oneWayPriceText(t, language.code, 'arr'), t['takeaways.5']] },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [1, 3, 6]),
    },
    departure: {
      title: `${t['packages.dep.title']} | ${ui.guideSuffix}`,
      summary: metaDescription(t['packages.dep.desc'], t['compare.r2.2']),
      sections: [
        { heading: ui.serviceOverview, paragraphs: [packageFeatureText(t, 'dep'), t['compare.subtitle']] },
        { heading: ui.airportFlow, paragraphs: [cleanText(`${t['compare.f2']}: ${t['compare.r2.2']}. ${t['compare.f3']}: ${t['compare.r3.2']}.`), cleanText(`${t['compare.f4']}: ${t['compare.r4.2']}. ${t['compare.f5']}: ${t['compare.r5.2']}.`)] },
        { heading: ui.pricePlanning, paragraphs: [oneWayPriceText(t, language.code, 'dep'), comboPriceText(t, language.code)] },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [3, 6, 1]),
    },
    prices: {
      title: `${t['packages.title']} | ${ui.valueGuide}`,
      summary: metaDescription(t['packages.subtitle'], t['packages.footer']),
      sections: [
        { heading: t['packages.title'], paragraphs: pricePlanning },
        { heading: t['pkg_section.title'], paragraphs: serviceOverview },
        { heading: t['compare.title'], paragraphs: [t['compare.subtitle'], cleanText(`${t['compare.f1']}: ${t['compare.r1.1']} / ${t['compare.r1.2']}.`)] },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [1, 4, 6]),
    },
    'peak-season': {
      title: ui.peakTitle,
      summary: metaDescription(t['compare.subtitle'], t['takeaways.4']),
      sections: [
        { heading: t['compare.title'], paragraphs: [t['compare.subtitle'], cleanText(`${t['compare.f1']}: ${t['compare.r1.1']} / ${t['compare.r1.2']}. ${t['compare.f4']}: ${t['compare.r4.2']}.`)] },
        { heading: ui.airportFlow, paragraphs: airportFlow },
        { heading: t['guides.tdac.t'], paragraphs: tdacPlanning },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [3, 1, 4]),
    },
    tdac: {
      title: ui.tdacBridgeTitle,
      summary: metaDescription(t['guides.tdac.d'], t['faq.4.a']),
      sections: [
        { heading: t['guides.tdac.t'], paragraphs: tdacPlanning },
        { heading: t['packages.combo.title'], paragraphs: [packageFeatureText(t, 'combo'), comboPriceText(t, language.code)] },
        { heading: ui.airportFlow, paragraphs: airportFlow },
        { heading: ui.bookingPrep, paragraphs: bookingPrep },
      ],
      faq: localizedFaq(t, [4, 3, 6]),
    },
  };

  const localized = topicContent[page.key] || topicContent.complete;
  const description = metaDescription(localized.summary);

  return {
    ...page,
    title: localized.title,
    description,
    summary: localized.summary,
    keywords: [
      t['packages.arr.title'],
      t['packages.dep.title'],
      t['packages.title'],
      t['guides.tdac.t'],
      'Phuket Airport HKT',
    ],
    sections: localized.sections,
    faq: localized.faq,
  };
};

const blogIndexUrl = (code) => code === 'en' ? `${BASE_URL}/blog/` : `${BASE_URL}/${code}/blog/`;
const blogPageUrl = (code, page) => code === 'en'
  ? `${BASE_URL}/blog/${page.slug}/`
  : `${BASE_URL}/${code}/blog/${page.slug}/`;

const blogAlternateLinksHtml = (page) => [
  ...languages.map((language) => (
    `    <link rel="alternate" hreflang="${language.htmlLang}" href="${page ? blogPageUrl(language.code, page) : blogIndexUrl(language.code)}" />`
  )),
  `    <link rel="alternate" hreflang="x-default" href="${page ? blogPageUrl('en', page) : blogIndexUrl('en')}" />`,
].join('\n');

const blogAlternateLinksXml = (page) => [
  ...languages.map((language) => (
    `    <xhtml:link rel="alternate" hreflang="${language.htmlLang}" href="${page ? blogPageUrl(language.code, page) : blogIndexUrl(language.code)}" />`
  )),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${page ? blogPageUrl('en', page) : blogIndexUrl('en')}" />`,
].join('\n');

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

const renderLicenseNotice = (t) => `      <section class="license-notice" aria-labelledby="license-title">
        <figure class="license-image-card">
          <img src="/tat-license.jpeg" alt="${escapeHtml(t['license.imageAlt'])}" loading="lazy" width="930" height="1280" decoding="async" />
        </figure>
        <div>
          <p class="eyebrow">${escapeHtml(t['license.badge'])}</p>
          <h2 id="license-title">${escapeHtml(t['license.title'])}</h2>
          <p>${escapeHtml(t['license.desc'])}</p>
        </div>
      </section>`;

const renderArrivalMeetingNotice = (t) => `      <section class="meeting-notice" aria-labelledby="meeting-title">
        <div>
          <p class="eyebrow">${escapeHtml(t['meeting.badge'])}</p>
          <h2 id="meeting-title">${escapeHtml(t['meeting.title'])}</h2>
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
  const faqItems = faqItemIndexes.map((index) => ({
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
  const blogUi = blogUiFor(language.code);
  const blogHref = language.code === 'en' ? '/blog/' : `/${language.code}/blog/`;
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
    <link rel="alternate" type="application/rss+xml" title="VIP Fast Track Phuket Airport (HKT) Guides" href="${FEED_URL}" />
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
      <a href="${blogHref}">${escapeHtml(blogUi.hubShort)}</a>
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

${renderArrivalMeetingNotice(t)}

      <section>
        <h2>${escapeHtml(t['packages.title'])}</h2>
        <p>${escapeHtml(t['packages.subtitle'])}</p>
        <table>
          <thead>
            <tr>
              <th>${escapeHtml(t['packages.th1'])}</th>
              <th>${escapeHtml(t['packages.th2'])}</th>
              <th>${escapeHtml(t['packages.th4'].replace('|', ' '))}</th>
              <th>${escapeHtml(t['packages.th5'].replace('|', ' '))}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/arrival-fast-track/">${escapeHtml(t['packages.arr.title'])}</a></td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.arr.adult, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.arr.child, language.code))}</td>
              <td>${escapeHtml(t['packages.price.infant'])}</td>
            </tr>
            <tr>
              <td><a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a></td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.dep.adult, language.code))}</td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.dep.child, language.code))}</td>
              <td>${escapeHtml(t['packages.price.infant'])}</td>
            </tr>
            <tr>
              <td><a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.combo.title'])}</a></td>
              <td>${escapeHtml(formatLocalizedPrice(thbPrices.combo.adult, language.code))}</td>
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
${faqItemIndexes.map((index) => `        <article>
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

const renderBlogNav = (language, t) => {
  const ui = blogUiFor(language.code);
  const homeHref = language.code === 'en' ? '/' : `/${language.code}/`;
  const blogHref = language.code === 'en' ? '/blog/' : `/${language.code}/blog/`;

  return `    <nav aria-label="Primary">
      <a href="${homeHref}">${escapeHtml(ui.home)}</a>
      <a href="/arrival-fast-track/">${escapeHtml(t['packages.arr.title'])}</a>
      <a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a>
      <a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.title'])}</a>
      <a href="/tdac-guide/">${escapeHtml(t['guides.tdac.t'])}</a>
      <a href="/faq/">${escapeHtml(t['faq.title'])}</a>
      <a href="${blogHref}">${escapeHtml(ui.hubShort)}</a>
      <a href="/llms.txt">${escapeHtml(ui.aiSummary)}</a>
    </nav>`;
};

const renderBlogStructuredData = (page, url, language) => {
  const ui = blogUiFor(language.code);
  const homeUrl = languageUrl(language.code);
  const blogUrl = blogIndexUrl(language.code);

  return JSON.stringify({
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
      inLanguage: language.htmlLang,
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
      inLanguage: language.htmlLang,
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
          name: ui.home,
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: ui.hubShort,
          item: blogUrl,
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
};

const renderBlogIndexStructuredData = (language, localizedPages) => {
  const ui = blogUiFor(language.code);
  const url = blogIndexUrl(language.code);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: ui.hubTitle,
    description: ui.hubDescription,
    inLanguage: language.htmlLang,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      name: 'VIP Fast Track Phuket Airport (HKT)',
      url: `${BASE_URL}/`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: localizedPages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: blogPageUrl(language.code, page),
        name: page.title,
      })),
    },
  }, null, 2).replaceAll('<', '\\u003c');
};

const renderBlogIndexPage = (language, t) => {
  const ui = blogUiFor(language.code);
  const localizedPages = blogPages.map((page) => buildLocalizedBlogPage(page, language, t));
  const url = blogIndexUrl(language.code);

  return `<!doctype html>
<html lang="${language.htmlLang}" dir="${language.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(ui.hubTitle)} | HKT VIP Travel Advice</title>
    <meta name="description" content="${escapeHtml(ui.hubDescription)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="stylesheet" href="/seo.css" />
    <link rel="sitemap" type="application/xml" href="${BASE_URL}/sitemap.xml" />
    <link rel="alternate" type="application/rss+xml" title="VIP Fast Track Phuket Airport (HKT) Guides" href="${FEED_URL}" />
${blogAlternateLinksHtml()}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(ui.hubTitle)}" />
    <meta property="og:description" content="${escapeHtml(ui.hubDescription)}" />
    <meta property="og:image" content="${BASE_URL}/hkt-airport.png" />
    <meta property="og:locale" content="${language.ogLocale}" />
    <script type="application/ld+json">
${renderBlogIndexStructuredData(language, localizedPages)}
    </script>
  </head>
  <body>
${renderBlogNav(language, t)}
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">HKT airport guides · ${escapeHtml(ui.updated)} ${LASTMOD}</p>
          <h1>${escapeHtml(ui.hubTitle)}</h1>
          <p>${escapeHtml(ui.hubIntro)}</p>
          <div class="cta">
            <a class="button" href="https://wa.me/66618016793">${escapeHtml(ui.bookWhatsApp)}</a>
            <a class="button" href="https://t.me/fast_track_phuket">${escapeHtml(ui.bookTelegram)}</a>
          </div>
        </div>
        <img src="/hkt-airport.png" alt="Phuket International Airport HKT" width="640" height="640" fetchpriority="high" decoding="async" />
      </section>

${renderLicenseNotice(t)}

      <section>
        <h2>${escapeHtml(ui.allGuides)}</h2>
        <div class="cards">
${localizedPages.map((page) => `          <article class="card">
            <h3><a href="${new URL(blogPageUrl(language.code, page)).pathname}">${escapeHtml(page.title)}</a></h3>
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
};

const renderBlogPage = (page, language, t) => {
  const ui = blogUiFor(language.code);
  const localizedPage = buildLocalizedBlogPage(page, language, t);
  const url = blogPageUrl(language.code, page);

  return `<!doctype html>
<html lang="${language.htmlLang}" dir="${language.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(localizedPage.title)} | VIP Fast Track Phuket Airport (HKT)</title>
    <meta name="description" content="${escapeHtml(localizedPage.description)}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${url}" />
    <link rel="stylesheet" href="/seo.css" />
    <link rel="sitemap" type="application/xml" href="${BASE_URL}/sitemap.xml" />
    <link rel="alternate" type="application/rss+xml" title="VIP Fast Track Phuket Airport (HKT) Guides" href="${FEED_URL}" />
${blogAlternateLinksHtml(page)}
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(localizedPage.title)}" />
    <meta property="og:description" content="${escapeHtml(localizedPage.description)}" />
    <meta property="og:image" content="${BASE_URL}/hkt-airport.png" />
    <meta property="og:locale" content="${language.ogLocale}" />
    <meta property="article:published_time" content="${PUBLISHED}" />
    <meta property="article:modified_time" content="${LASTMOD}" />
    <script type="application/ld+json">
${renderBlogStructuredData(localizedPage, url, language)}
    </script>
  </head>
  <body>
${renderBlogNav(language, t)}
    <main>
      <article>
        <header class="hero">
          <div>
            <p class="eyebrow">${escapeHtml(ui.guideKicker)} · ${escapeHtml(ui.updated)} ${LASTMOD}</p>
            <h1>${escapeHtml(localizedPage.title)}</h1>
            <p>${escapeHtml(localizedPage.summary)}</p>
            <div class="cta">
              <a class="button" href="https://wa.me/66618016793">${escapeHtml(ui.askWhatsApp)}</a>
              <a class="button" href="https://t.me/fast_track_phuket">${escapeHtml(ui.askTelegram)}</a>
            </div>
          </div>
          <img src="/hkt-airport.png" alt="${escapeHtml(localizedPage.title)}" width="640" height="640" fetchpriority="high" decoding="async" />
        </header>

        <section class="fact-grid" aria-label="Guide topics">
${localizedPage.keywords.map((keyword) => `          <div class="fact">${escapeHtml(keyword)}</div>`).join('\n')}
        </section>

${renderLicenseNotice(t)}

${localizedPage.sections.map((section) => `        <section>
          <h2>${escapeHtml(section.heading)}</h2>
${section.paragraphs.map((paragraph) => `          <p>${escapeHtml(paragraph)}</p>`).join('\n')}
        </section>`).join('\n\n')}

        <section>
          <h2>${escapeHtml(ui.commonQuestions)}</h2>
${localizedPage.faq.map((item) => `          <article>
            <h3>${escapeHtml(item.q)}</h3>
            <p>${escapeHtml(item.a)}</p>
          </article>`).join('\n')}
        </section>

        <section>
          <h2>${escapeHtml(ui.relatedTitle)}</h2>
          <div class="cards">
            <article class="card">
              <h3><a href="/arrival-fast-track/">${escapeHtml(t['packages.arr.title'])}</a></h3>
              <p>${escapeHtml(ui.relatedArrival)}</p>
            </article>
            <article class="card">
              <h3><a href="/departure-vip/">${escapeHtml(t['packages.dep.title'])}</a></h3>
              <p>${escapeHtml(ui.relatedDeparture)}</p>
            </article>
            <article class="card">
              <h3><a href="/phuket-airport-fast-track-prices/">${escapeHtml(t['packages.title'])}</a></h3>
              <p>${escapeHtml(ui.relatedPrices)}</p>
            </article>
            <article class="card">
              <h3><a href="/tdac-guide/">${escapeHtml(t['guides.tdac.t'])}</a></h3>
              <p>${escapeHtml(ui.relatedTdac)}</p>
            </article>
          </div>
        </section>
      </article>
    </main>
    <footer>
      <p>VIP Fast Track Phuket Airport (HKT) · 222 Mai Khao, Thalang District, Phuket 83110, Thailand · <a href="${language.code === 'en' ? '/blog/' : `/${language.code}/blog/`}">${escapeHtml(ui.allGuides)}</a> · <a href="/ai.txt">AI permissions</a> · <a href="/sitemap.xml">Sitemap</a></p>
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

  const blogUrls = [
    ...languages.map((language) => ({
      loc: blogIndexUrl(language.code),
      priority: language.code === 'en' ? '0.85' : '0.8',
      changefreq: 'weekly',
      alternates: blogAlternateLinksXml(),
    })),
    ...blogPages.flatMap((page) => languages.map((language) => ({
      loc: blogPageUrl(language.code, page),
      priority: language.code === 'en' ? '0.8' : '0.75',
      changefreq: 'monthly',
      alternates: blogAlternateLinksXml(page),
    }))),
  ];

  const supportingEntries = [...supportingUrls, ...blogUrls].map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.alternates ? `\n${url.alternates}` : ''}${url.loc.endsWith('/') ? `\n${imageBlock(HERO_IMAGE)}` : ''}
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...homeEntries, ...supportingEntries].join('\n')}
</urlset>
`;
};

const renderRssFeed = () => {
  const buildDate = new Date(`${LASTMOD}T00:00:00.000Z`).toUTCString();
  const publishedDate = new Date(`${PUBLISHED}T00:00:00.000Z`).toUTCString();
  const rssItems = languages.flatMap((language) => {
    const locale = loadLocale(language.code);

    return blogPages.map((page) => ({
      language,
      localizedPage: buildLocalizedBlogPage(page, language, locale),
      url: blogPageUrl(language.code, page),
    }));
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VIP Fast Track Phuket Airport (HKT) Guides</title>
    <link>${BASE_URL}/blog/</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Multilingual guides for VIP Fast Track Phuket Airport (HKT), arrival immigration, departure VIP service, prices, TDAC, and peak-season planning.</description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${rssItems.map(({ language, localizedPage, url }) => `    <item>
      <title>${escapeXml(localizedPage.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${publishedDate}</pubDate>
      <dc:language>${escapeXml(language.htmlLang)}</dc:language>
      <category>${escapeXml(language.name)}</category>
      <description>${escapeXml(localizedPage.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
};

for (const language of languages.filter((item) => item.code !== 'en')) {
  const locale = loadLocale(language.code);
  const outputDir = path.join(publicDir, language.code);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderLanguagePage(language, locale));
}

for (const language of languages) {
  const locale = loadLocale(language.code);
  const blogDir = language.code === 'en'
    ? path.join(publicDir, 'blog')
    : path.join(publicDir, language.code, 'blog');

  fs.mkdirSync(blogDir, { recursive: true });
  fs.writeFileSync(path.join(blogDir, 'index.html'), renderBlogIndexPage(language, locale));

  for (const page of blogPages) {
    const outputDir = path.join(blogDir, page.slug);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), renderBlogPage(page, language, locale));
  }
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), renderSitemap());
fs.writeFileSync(path.join(publicDir, 'feed.xml'), renderRssFeed());

console.log(`Generated ${languages.length - 1} localized SEO pages, ${languages.length * (blogPages.length + 1)} guide pages, sitemap.xml, and feed.xml`);
