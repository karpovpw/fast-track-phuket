import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
  serializeJsonLd,
} from './site-shared.mjs';

const TODAY = new Date().toISOString().slice(0, 10);
const HERO_IMAGE = `${BASE_URL}/hkt-airport.png`;
const FEED_URL = `${BASE_URL}/feed.xml`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const localeDir = path.join(projectRoot, 'src', 'locales');

// Honest freshness dates. Every generated file records a content hash in
// scripts/seo-dates.json; its lastmod/dateModified only advances to today when
// the rendered content (with the date stamps still tokenized) actually changed.
// Stamping every URL with the build date teaches Google to distrust lastmod.
const datesPath = path.join(__dirname, 'seo-dates.json');
const datesManifest = fs.existsSync(datesPath)
  ? JSON.parse(fs.readFileSync(datesPath, 'utf8'))
  : { urls: {}, published: {} };

// Render functions emit these tokens via the LASTMOD/PUBLISHED constants; the
// tokens are hashed as-is, then substituted with real dates on write.
const LASTMOD = '__SEO_LASTMOD__';
const PUBLISHED = '__SEO_PUBLISHED__';

const contentHash = (value) => crypto.createHash('sha1').update(value).digest('hex');

const resolveLastmod = (key, hashInput) => {
  const hash = contentHash(hashInput);
  const entry = datesManifest.urls[key];
  if (entry && entry.hash === hash) return entry.lastmod;
  datesManifest.urls[key] = { hash, lastmod: TODAY };
  return TODAY;
};

const resolvePublished = (slug) => {
  if (!datesManifest.published[slug]) datesManifest.published[slug] = TODAY;
  return datesManifest.published[slug];
};

// Per-URL lastmod values collected while writing pages, consumed by the sitemap.
const lastmodByLoc = new Map();

const finalizeDatedFile = (key, content, publishedDate) => {
  const lastmod = resolveLastmod(key, content);
  lastmodByLoc.set(key, lastmod);
  return content
    .replaceAll(LASTMOD, lastmod)
    .replaceAll(PUBLISHED, publishedDate || lastmod);
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

const expandedBlogPages = [
  {
    key: 'queue-times',
    group: 'airport-flow',
    slug: 'phuket-airport-immigration-queue-times',
    title: 'Phuket Airport Immigration Queue Times: When HKT Gets Busy',
    description: 'Guide to Phuket Airport immigration queue times by season, flight wave, documents, TDAC readiness, and when VIP Fast Track is useful at HKT.',
    summary: 'Immigration wait time at Phuket Airport changes by season, time of day, and how many international flights arrive together. This guide explains the risk windows and how to prepare.',
    keywords: ['Phuket Airport immigration queue times', 'HKT wait times', 'Phuket immigration fast track', 'Phuket Airport peak hours'],
    localizedTitles: {
      ru: 'Очереди на иммиграции в аэропорту Пхукета: когда HKT загружен',
      zh: '普吉机场入境排队时间：HKT 什么时候最繁忙',
      hi: 'फुकेत एयरपोर्ट इमिग्रेशन कतार समय: HKT कब व्यस्त होता है',
      he: 'זמני תור בהגירה בנמל התעופה פוקט: מתי HKT עמוס',
      ar: 'أوقات طوابير الهجرة في مطار بوكيت: متى يكون HKT مزدحما',
      es: 'Tiempos de espera en inmigracion del Aeropuerto de Phuket',
      fr: 'Temps d attente a l immigration de l aeroport de Phuket',
      de: 'Wartezeiten bei der Immigration am Flughafen Phuket',
      it: 'Tempi di attesa all immigrazione dell aeroporto di Phuket',
    },
    sections: [
      {
        heading: 'Why queues change so much at HKT',
        paragraphs: [
          'Phuket Airport does not have one fixed immigration wait time. The line can be light when arrivals are spread out, then become crowded when several international flights land in the same wave. Long-haul passengers, tour groups, families, and travelers who need document checks can all slow the flow.',
          'The practical issue is uncertainty. A traveler may pass passport control quickly on one trip and wait much longer on the next because the flight wave, season, staffing, TDAC readiness, or gate position is different.',
        ],
      },
      {
        heading: 'Risk windows to plan around',
        paragraphs: [
          'High season, school-holiday periods, long weekends, December and January travel, Chinese New Year, and late afternoon to evening international arrivals usually deserve more planning. Early morning waves can also be busy when several regional flights arrive close together.',
          'If you are booking a transfer, villa check-in, yacht departure, restaurant reservation, or domestic onward flight, avoid building the schedule around a best-case immigration time. Use a buffer or book Arrival Fast Track when certainty matters.',
        ],
      },
      {
        heading: 'How to reduce regular-line friction',
        paragraphs: [
          'Complete TDAC before travel when required, keep passport and accommodation details easy to reach, and make sure every family member has the correct documents ready. Small delays at the counter can multiply when many passengers are unprepared.',
          'Walk calmly but directly from the aircraft to immigration, keep your group together, and avoid stopping for SIM cards or currency exchange before passport control. Those tasks are easier after immigration and baggage claim.',
        ],
      },
      {
        heading: 'When Fast Track makes the most sense',
        paragraphs: [
          `Arrival Fast Track is strongest when a wait would affect the first day of the trip. The current adult price anchor is ${p('arr', 'adult')}, with child pricing at ${p('arr', 'child')} and infants from 0 to 2 free.`,
          'The service cannot change immigration law or guarantee entry approval, but it can reduce terminal uncertainty by arranging a meeting process, guiding the passenger to the correct flow, and coordinating after passport control.',
        ],
      },
    ],
    faq: [
      {
        q: 'How long is immigration at Phuket Airport?',
        a: 'It varies by flight wave and season. Plan for variability rather than a single average, especially during high season and overlapping international arrivals.',
      },
      {
        q: 'Does TDAC reduce immigration waiting?',
        a: 'TDAC readiness helps avoid avoidable document friction, but it does not remove normal passport control or queue pressure.',
      },
      {
        q: 'Should I book Fast Track just for queue times?',
        a: 'Book it when the cost of uncertainty is high: family fatigue, a driver waiting, a connection, a villa check-in, business timing, or senior-passenger comfort.',
      },
    ],
  },
  {
    key: 'airport-arrival-guide',
    group: 'airport-flow',
    slug: 'phuket-airport-arrival-guide',
    title: 'Phuket Airport Arrival Guide: Immigration, Bags, Customs, Exit',
    description: 'Practical guide to arriving at Phuket Airport HKT: immigration, TDAC, baggage claim, customs, SIM cards, taxis, drivers, and Arrival Fast Track.',
    summary: 'A step-by-step guide for international arrivals at HKT, from leaving the aircraft to meeting a driver outside the arrivals hall.',
    keywords: ['Phuket Airport arrival guide', 'HKT arrivals', 'Phuket Airport immigration', 'Phuket Airport customs'],
    localizedTitles: {
      ru: 'Гид по прилету в аэропорт Пхукета: иммиграция, багаж, таможня и выход',
      zh: '普吉机场到达指南：入境、行李、海关和出口',
      hi: 'फुकेत एयरपोर्ट आगमन गाइड: इमिग्रेशन, बैग, कस्टम और बाहर निकलना',
      he: 'מדריך הגעה לנמל התעופה פוקט: הגירה, כבודה, מכס ויציאה',
      ar: 'دليل الوصول إلى مطار بوكيت: الهجرة والحقائب والجمارك والخروج',
      es: 'Guia de llegada al Aeropuerto de Phuket: inmigracion, equipaje, aduanas y salida',
      fr: 'Guide d arrivee a l aeroport de Phuket: immigration, bagages, douane et sortie',
      de: 'Ankunft am Flughafen Phuket: Immigration, Gepack, Zoll und Ausgang',
      it: 'Guida arrivi aeroporto di Phuket: immigrazione, bagagli, dogana e uscita',
    },
    sections: [
      {
        heading: 'The normal arrival sequence',
        paragraphs: [
          'Most international passengers follow the same basic path at HKT: leave the aircraft, walk to passport control, clear immigration, collect checked baggage, pass customs, and enter the arrivals hall.',
          'The walking distance, gate position, remote stand handling, queue length, and baggage timing can change the total airport time. Travelers who have never used HKT should avoid assuming the process will feel like a small domestic airport.',
        ],
      },
      {
        heading: 'Documents to keep ready',
        paragraphs: [
          'Keep your passport, boarding pass, TDAC confirmation when applicable, accommodation address, return or onward travel details, and visa-related documents easy to access. Families should keep children close and organize passports before the queue.',
          'A Fast Track escort can guide the route, but the traveler remains responsible for entry eligibility and documents. Immigration approval always belongs to Thai authorities.',
        ],
      },
      {
        heading: 'After passport control',
        paragraphs: [
          'After immigration, check the baggage screens, collect luggage, and follow the correct customs lane. Most travelers with nothing to declare use the green channel, while restricted or declarable goods require the appropriate customs process.',
          'SIM cards, ATMs, currency exchange, taxi counters, app-based ride pickup plans, private drivers, and hotel transfers are easier to handle once the group has exited into the public arrivals area.',
        ],
      },
      {
        heading: 'Where Arrival Fast Track helps',
        paragraphs: [
          'Arrival Fast Track adds a coordinated meeting process and guided airport movement. It is especially useful for long-haul arrivals, families, seniors, guests with a villa driver waiting, and passengers who prefer not to solve airport routing after a tiring flight.',
          `The one-way arrival price anchor is ${p('arr', 'adult')} per adult passenger. Children under 12 are ${p('arr', 'child')}, and infants from 0 to 2 are free.`,
        ],
      },
    ],
    faq: [
      {
        q: 'What should I do first after landing at Phuket Airport?',
        a: 'Follow immigration signs and keep passport and required entry information ready. Handle SIM cards, cash, and transport after passport control.',
      },
      {
        q: 'Can Arrival Fast Track help after immigration?',
        a: 'Yes. The escort can help with terminal direction, baggage-flow coordination, customs route direction, and finding the agreed exit or driver meeting point.',
      },
      {
        q: 'Is Phuket Airport arrival confusing for first-time visitors?',
        a: 'The route is manageable, but crowds, long walks, and queue variability make guided assistance valuable for many first-time travelers.',
      },
    ],
  },
  {
    key: 'airport-departure-guide',
    group: 'airport-flow',
    slug: 'phuket-airport-departure-guide',
    title: 'Phuket Airport Departure Guide: Check-In, Security, Immigration',
    description: 'Guide to departing from Phuket Airport HKT: when to arrive, check-in, security, passport control, lounge timing, traffic buffers, and Departure VIP.',
    summary: 'Departure from HKT is easier when you plan check-in, security, passport control, traffic from your beach area, and any VIP assistance as one timeline.',
    keywords: ['Phuket Airport departure guide', 'HKT departure', 'Phuket Airport check-in', 'Phuket departure immigration'],
    localizedTitles: {
      ru: 'Гид по вылету из аэропорта Пхукета: регистрация, безопасность и паспортный контроль',
      zh: '普吉机场出发指南：值机、安检和出境检查',
      hi: 'फुकेत एयरपोर्ट प्रस्थान गाइड: चेक-इन, सुरक्षा और इमिग्रेशन',
      he: 'מדריך יציאה מנמל התעופה פוקט: צק-אין, ביטחון וביקורת דרכונים',
      ar: 'دليل المغادرة من مطار بوكيت: تسجيل الوصول والأمن والهجرة',
      es: 'Guia de salida del Aeropuerto de Phuket: check-in, seguridad e inmigracion',
      fr: 'Guide de depart de l aeroport de Phuket: enregistrement, securite et immigration',
      de: 'Abflug am Flughafen Phuket: Check-in, Sicherheit und Passkontrolle',
      it: 'Guida partenze aeroporto di Phuket: check-in, sicurezza e immigrazione',
    },
    sections: [
      {
        heading: 'Start with the road, not the terminal',
        paragraphs: [
          'A smooth departure begins before the airport. Traffic from Patong, Kata, Karon, Rawai, Bang Tao, or Phuket Town can change sharply by time of day, weather, event traffic, and road works.',
          'Build a realistic road buffer, then add airline check-in time, baggage drop, document checks, security, departure passport control, and the walk to the gate. VIP assistance improves terminal flow but does not replace airline deadlines.',
        ],
      },
      {
        heading: 'The normal departure sequence',
        paragraphs: [
          'International passengers typically enter the terminal, find the airline check-in counter, drop bags, clear security and passport control, then move toward the gate or lounge area.',
          'Problems usually come from late arrival, document questions, overweight baggage, crowded counters, or a group that is not ready together. Preparing the group before reaching the terminal saves time.',
        ],
      },
      {
        heading: 'What to prepare before leaving the hotel',
        paragraphs: [
          'Confirm flight time, terminal, passport, ticket, visa or entry-status documents for the next country, baggage allowance, batteries and liquids rules, and any airline app or online check-in status.',
          'If using a private driver, share the airport departure time clearly. For families or groups, choose a single lead passenger who holds the booking details and can communicate with the VIP escort.',
        ],
      },
      {
        heading: 'Where Departure VIP helps',
        paragraphs: [
          'Departure VIP is useful when the terminal is busy, when passengers dislike airport uncertainty, when there are children or senior travelers, or when a business traveler wants a predictable path to the gate.',
          `The departure price anchor is ${p('dep', 'adult')} per adult passenger. If you also want arrival support, compare the combo at ${p('combo', 'adult')} per adult.`,
        ],
      },
    ],
    faq: [
      {
        q: 'How early should I arrive for an international departure from Phuket?',
        a: 'Follow your airline guidance and add a road buffer from your hotel area. During peak periods, avoid tight airport arrival plans.',
      },
      {
        q: 'Does Departure VIP remove check-in deadlines?',
        a: 'No. Airline deadlines, baggage rules, and document checks still apply. The service helps with terminal guidance and airport flow.',
      },
      {
        q: 'Can Departure VIP help me reach a lounge or gate?',
        a: 'The escort can guide you through the departure process and toward the gate area after formalities, depending on the booked service and airport procedure.',
      },
    ],
  },
  {
    key: 'what-is-fast-track',
    group: 'fast-track-basics',
    slug: 'what-is-airport-fast-track',
    title: 'What Is Airport Fast Track? Phuket VIP Meet-and-Assist Explained',
    description: 'Plain-English explanation of airport Fast Track at Phuket HKT: personal escort, priority-lane guidance, arrival and departure support, limits, and prices.',
    summary: 'Airport Fast Track is meet-and-assist support through airport procedures. It is not a visa or immigration guarantee, but it can make the HKT airport process faster and clearer.',
    keywords: ['what is airport fast track', 'Phuket VIP meet and assist', 'HKT fast track service', 'airport concierge Phuket'],
    localizedTitles: {
      ru: 'Что такое Airport Fast Track: VIP сопровождение в аэропорту Пхукета',
      zh: '什么是机场 Fast Track：普吉 VIP 接待协助说明',
      hi: 'Airport Fast Track क्या है: फुकेत VIP meet-and-assist समझें',
      he: 'מהו Airport Fast Track: הסבר על VIP Meet-and-Assist בפוקט',
      ar: 'ما هي خدمة Airport Fast Track: شرح استقبال ومساعدة VIP في بوكيت',
      es: 'Que es Airport Fast Track: servicio VIP meet-and-assist en Phuket',
      fr: 'Qu est-ce que Airport Fast Track: assistance VIP a Phuket',
      de: 'Was ist Airport Fast Track: VIP Meet-and-Assist in Phuket',
      it: 'Cos e Airport Fast Track: meet-and-assist VIP a Phuket',
    },
    sections: [
      {
        heading: 'Fast Track in simple terms',
        paragraphs: [
          'Airport Fast Track is a paid meet-and-assist service. A trained airport escort meets the passenger at an approved point, guides the traveler through the relevant airport process, and helps reduce uncertainty in a crowded terminal.',
          'At Phuket Airport, Fast Track can apply to international arrival, international departure, or both directions as a combo booking. The exact flow depends on airport rules, flight timing, gate assignment, and service availability.',
        ],
      },
      {
        heading: 'What it is not',
        paragraphs: [
          'Fast Track is not a visa, border exemption, customs exemption, or promise of entry into Thailand. It does not allow travelers to ignore documents, airline rules, prohibited goods, or immigration questions.',
          'The service is operational support: meeting coordination, route guidance, priority-lane direction when available, airport communication, and help finding the next step after formalities.',
        ],
      },
      {
        heading: 'Arrival versus departure',
        paragraphs: [
          'Arrival Fast Track focuses on landing, meeting the escort, moving through immigration, and coordinating the route toward baggage, customs, and the exit or driver meeting point.',
          'Departure VIP focuses on terminal entrance meeting, check-in coordination where useful, passport-control and security guidance, and movement toward the gate area.',
        ],
      },
      {
        heading: 'Who should consider it',
        paragraphs: [
          'The clearest use cases are families, senior passengers, first-time visitors, business travelers, passengers arriving after long flights, and guests with a tight onward schedule.',
          `Current price anchors are ${p('arr', 'adult')} for arrival, ${p('dep', 'adult')} for departure, and ${p('combo', 'adult')} for arrival plus departure per adult passenger.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is Airport Fast Track legal?',
        a: 'Fast Track uses airport-approved meet-and-assist procedures and available priority flows. Immigration decisions still remain with Thai authorities.',
      },
      {
        q: 'Does Fast Track include a personal escort?',
        a: 'Yes. The core value is a coordinated airport escort who guides the passenger through the booked direction of travel.',
      },
      {
        q: 'Can Fast Track be booked for only one direction?',
        a: 'Yes. Arrival, departure, and arrival plus departure combo bookings are separate options.',
      },
    ],
  },
  {
    key: 'priority-lane',
    group: 'fast-track-basics',
    slug: 'phuket-airport-priority-lane-vs-fast-track',
    title: 'Phuket Airport Priority Lane vs Fast Track: What Is the Difference?',
    description: 'Compare Phuket Airport priority lane, VIP Fast Track, airport escort, and regular immigration so travelers understand what they are booking at HKT.',
    summary: 'Priority lane and Fast Track are often used as if they mean the same thing, but travelers should understand the difference between a lane, an escort, and a complete meet-and-assist service.',
    keywords: ['Phuket Airport priority lane', 'priority lane vs fast track', 'HKT VIP lane', 'Phuket express immigration'],
    localizedTitles: {
      ru: 'Priority Lane и Fast Track в аэропорту Пхукета: в чем разница',
      zh: '普吉机场 Priority Lane 与 Fast Track：有什么区别',
      hi: 'फुकेत एयरपोर्ट Priority Lane बनाम Fast Track: अंतर क्या है',
      he: 'Priority Lane מול Fast Track בנמל התעופה פוקט: מה ההבדל',
      ar: 'المسار السريع و Fast Track في مطار بوكيت: ما الفرق',
      es: 'Priority Lane vs Fast Track en el Aeropuerto de Phuket: diferencias',
      fr: 'Priority Lane vs Fast Track a l aeroport de Phuket: differences',
      de: 'Priority Lane vs Fast Track am Flughafen Phuket: die Unterschiede',
      it: 'Priority Lane vs Fast Track all aeroporto di Phuket: differenze',
    },
    sections: [
      {
        heading: 'A lane is only one part of the service',
        paragraphs: [
          'A priority lane is a physical or procedural route inside the airport. Fast Track is the broader service that helps the passenger meet the escort, reach the correct route, and continue through the terminal after formalities.',
          'This distinction matters because travelers are not usually buying only a sign or a lane. They are buying coordination: flight monitoring, meeting instructions, airport navigation, and a person who helps manage the process.',
        ],
      },
      {
        heading: 'Why wording can be confusing',
        paragraphs: [
          'Search results and booking sites may use terms like VIP lane, priority immigration, express lane, meet and assist, concierge, or Fast Track. Some pages use these terms loosely.',
          'Before booking, check what is actually included: arrival or departure direction, meeting point, flight monitoring, terminal guidance, children pricing, cancellation rules, and contact support.',
        ],
      },
      {
        heading: 'What regular immigration includes',
        paragraphs: [
          'Regular immigration is the standard public queue. It is free and enough for many flexible travelers, but it gives no personal escort, no coordination with a driver, and no help choosing the right process if the terminal is crowded.',
          'The regular route can be perfectly acceptable on a quiet day. The problem is that most passengers do not know the queue condition until they arrive.',
        ],
      },
      {
        heading: 'How to choose',
        paragraphs: [
          'Choose regular flow if time is flexible and you are comfortable navigating HKT. Choose a full Fast Track booking if the meeting process, guided movement, and post-immigration coordination are important.',
          `If both arrival and departure matter, the combo price anchor is ${p('combo', 'adult')} per adult passenger and keeps both directions in one booking conversation.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is priority lane the same as Fast Track?',
        a: 'Not exactly. The lane is one part of the airport process; Fast Track usually means the broader meet-and-assist service around it.',
      },
      {
        q: 'Can I access a priority lane without an escort?',
        a: 'Access depends on airport procedure, traveler eligibility, and booked service. Do not assume walk-in lane access is available.',
      },
      {
        q: 'What should I ask before booking?',
        a: 'Ask where the escort meets you, which direction is included, how delays are handled, and what happens after passport control.',
      },
    ],
  },
  {
    key: 'green-channel',
    group: 'fast-track-basics',
    slug: 'phuket-airport-green-channel-vs-fast-track',
    title: 'Phuket Airport Green Channel vs Fast Track: Customs and Immigration Explained',
    description: 'Explain the difference between Phuket Airport green channel customs, immigration, and VIP Fast Track so arriving travelers avoid confusion at HKT.',
    summary: 'The green channel is a customs concept after baggage claim. Fast Track is an airport assistance service around immigration and terminal navigation. They solve different problems.',
    keywords: ['Phuket Airport green channel', 'green channel vs fast track', 'Phuket customs', 'HKT immigration fast track'],
    localizedTitles: {
      ru: 'Green Channel и Fast Track в аэропорту Пхукета: таможня и иммиграция',
      zh: '普吉机场绿色通道与 Fast Track：海关和入境说明',
      hi: 'फुकेत एयरपोर्ट Green Channel बनाम Fast Track: कस्टम और इमिग्रेशन',
      he: 'Green Channel מול Fast Track בנמל התעופה פוקט: מכס והגירה',
      ar: 'القناة الخضراء و Fast Track في مطار بوكيت: الجمارك والهجرة',
      es: 'Green Channel vs Fast Track en Phuket: aduanas e inmigracion',
      fr: 'Green Channel vs Fast Track a Phuket: douane et immigration',
      de: 'Green Channel vs Fast Track in Phuket: Zoll und Immigration',
      it: 'Green Channel vs Fast Track a Phuket: dogana e immigrazione',
    },
    sections: [
      {
        heading: 'Green channel means customs',
        paragraphs: [
          'At many airports, green channel means the customs route for travelers with nothing to declare after baggage claim. It is not the same as immigration and it is not a paid VIP escort service.',
          'Travelers who have goods to declare, restricted items, or questions about customs rules should use the appropriate customs route. Fast Track does not change customs obligations.',
        ],
      },
      {
        heading: 'Fast Track means airport assistance',
        paragraphs: [
          'Fast Track focuses on meeting, immigration guidance, terminal navigation, and movement toward baggage, customs, and exit. It helps travelers understand the airport route and reduce queue uncertainty.',
          'The escort can point passengers toward the correct next step, but the passenger remains responsible for honest customs declaration and legal compliance.',
        ],
      },
      {
        heading: 'Why travelers mix them up',
        paragraphs: [
          'Both terms are associated with moving faster through an airport, so they often appear together in search results. In practice, they refer to different stages of arrival.',
          'Think of immigration as permission to enter, customs as goods declaration, and Fast Track as guided support through the airport process. Keeping those categories separate prevents booking mistakes.',
        ],
      },
      {
        heading: 'Arrival planning tip',
        paragraphs: [
          'If your main concern is passport-control waiting, book Arrival Fast Track. If your main concern is whether you have goods to declare, check customs rules before travel and pack accordingly.',
          'If both questions apply, prepare documents and baggage honestly, then use the escort for navigation and coordination rather than as a substitute for official requirements.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is the green channel a Fast Track lane?',
        a: 'No. Green channel usually refers to customs after baggage claim for travelers with nothing to declare.',
      },
      {
        q: 'Can Fast Track help with customs?',
        a: 'The escort can guide terminal movement, but customs rules and declarations remain the traveler responsibility.',
      },
      {
        q: 'Which comes first: immigration or customs?',
        a: 'For international arrivals, passport control normally comes before baggage claim and customs.',
      },
    ],
  },
  {
    key: 'same-day-booking',
    group: 'booking',
    slug: 'phuket-airport-fast-track-same-day-booking',
    title: 'Can You Book Phuket Airport Fast Track Same Day?',
    description: 'Same-day and last-minute Phuket Airport Fast Track booking guide: what details to send, realistic timing, flight delays, availability, and alternatives.',
    summary: 'Same-day Fast Track may be possible at HKT, but availability depends on flight timing, airport procedure, passenger details, payment, and how close the request is to landing or departure.',
    keywords: ['same day Phuket Fast Track', 'last minute HKT VIP service', 'book Fast Track Phuket today', 'urgent Phuket airport assistance'],
    localizedTitles: {
      ru: 'Можно ли забронировать Fast Track в аэропорту Пхукета в тот же день',
      zh: '普吉机场 Fast Track 可以当天预订吗',
      hi: 'क्या फुकेत एयरपोर्ट Fast Track उसी दिन बुक हो सकता है',
      he: 'האם אפשר להזמין Fast Track בפוקט באותו יום',
      ar: 'هل يمكن حجز Fast Track في مطار بوكيت في نفس اليوم',
      es: 'Se puede reservar Fast Track en Phuket el mismo dia',
      fr: 'Peut-on reserver Fast Track a Phuket le jour meme',
      de: 'Kann man Fast Track am Flughafen Phuket am selben Tag buchen',
      it: 'Si puo prenotare Fast Track a Phuket lo stesso giorno',
    },
    sections: [
      {
        heading: 'Same-day booking is a timing problem',
        paragraphs: [
          'Last-minute requests are not all the same. A request 10 hours before arrival is very different from a request while the aircraft is boarding or after landing.',
          'The team needs enough time to confirm flight details, passenger names, service direction, payment, meeting process, and escort availability. The closer the request is to service time, the less predictable availability becomes.',
        ],
      },
      {
        heading: 'What to send first',
        paragraphs: [
          'Send flight number, date, passenger names as passports show them, number of adults and children, arrival or departure direction, phone contact, and any driver or hotel timing that matters.',
          'Avoid sending partial information first if the flight is soon. A complete message lets the team answer quickly and reduces back-and-forth during the highest-pressure window.',
        ],
      },
      {
        heading: 'When advance booking is better',
        paragraphs: [
          'Book earlier for high season, family travel, large groups, senior passengers, night arrivals, or any trip where a driver or connection is already scheduled.',
          'For peak dates, 24 to 72 hours ahead is more comfortable. Same-day bookings should be treated as possible but not guaranteed.',
        ],
      },
      {
        heading: 'If Fast Track is unavailable',
        paragraphs: [
          'Complete TDAC, keep documents ready, move directly to immigration, coordinate the driver after passport control, and keep realistic buffers for the rest of the day.',
          'If only one direction is urgent, you can still book the available direction and consider the combo for a future trip when both arrival and departure matter.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is the minimum booking time for Phuket Fast Track?',
        a: 'Availability depends on current airport operations and escort capacity. Send full flight and passenger details as early as possible.',
      },
      {
        q: 'Can I book after my flight lands?',
        a: 'Usually that is too late for proper arrival coordination. Contact the team, but prepare to use the regular airport process.',
      },
      {
        q: 'Is departure easier to book last minute than arrival?',
        a: 'It depends on airport timing and staff availability. Departure still needs enough lead time before terminal arrival.',
      },
    ],
  },
  {
    key: 'family-guide',
    group: 'audience',
    slug: 'phuket-airport-with-kids-family-fast-track-guide',
    title: 'Phuket Airport With Kids: Family Arrival and Departure Guide',
    description: 'Family guide to Phuket Airport HKT with children: immigration, strollers, luggage, TDAC, transfer timing, departure stress, and when Fast Track helps.',
    summary: 'Families feel airport delays more strongly because children, strollers, luggage, and long flights turn small queue problems into real travel stress.',
    keywords: ['Phuket Airport with kids', 'family Fast Track Phuket', 'HKT family arrival', 'Phuket airport stroller'],
    localizedTitles: {
      ru: 'Аэропорт Пхукета с детьми: семейный гид по прилету и вылету',
      zh: '带孩子经过普吉机场：家庭到达和出发指南',
      hi: 'बच्चों के साथ फुकेत एयरपोर्ट: परिवार आगमन और प्रस्थान गाइड',
      he: 'נמל התעופה פוקט עם ילדים: מדריך משפחות להגעה ויציאה',
      ar: 'مطار بوكيت مع الأطفال: دليل العائلة للوصول والمغادرة',
      es: 'Aeropuerto de Phuket con ninos: guia familiar de llegada y salida',
      fr: 'Aeroport de Phuket avec enfants: guide famille arrivee et depart',
      de: 'Flughafen Phuket mit Kindern: Familienguide fur Ankunft und Abflug',
      it: 'Aeroporto di Phuket con bambini: guida famiglia arrivo e partenza',
    },
    sections: [
      {
        heading: 'Why families should plan differently',
        paragraphs: [
          'A solo traveler can tolerate uncertainty more easily than a family with tired children, strollers, carry-ons, checked bags, and a driver waiting outside. The first hour after landing often shapes the mood of the first day.',
          'Families should organize passports together, complete required entry information ahead of travel, and decide who manages children while another adult handles documents and communication.',
        ],
      },
      {
        heading: 'Arrival tips with children',
        paragraphs: [
          'Keep snacks, water after landing, charged phones, wipes, small toys, and basic medication accessible. If the child is sleeping, decide who carries bags and who stays with the child before joining the immigration flow.',
          'Book everyone under the same flight details and passenger list. Matching names to passports reduces confusion at the meeting point and during booking confirmation.',
        ],
      },
      {
        heading: 'Departure tips with children',
        paragraphs: [
          'Leave the hotel early enough to absorb traffic, bathroom stops, baggage issues, and child fatigue. Do not rely on VIP assistance to rescue an unrealistic airport arrival time.',
          'Before leaving, check passports, boarding passes, baggage weight, liquids, batteries, stroller handling, and airline rules for child seats or special items.',
        ],
      },
      {
        heading: 'Fast Track value for families',
        paragraphs: [
          `Children under 12 use child pricing at ${p('arr', 'child')} for one-way services, while infants from 0 to 2 are free. That makes the service easier to calculate before travel.`,
          'The value is not only minutes saved. It is having a meeting process, a guided route, and a single airport contact while the adults focus on the children.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do children need TDAC?',
        a: 'Official TDAC guidance says children and infants also require submission when TDAC applies, usually completed by a parent or guardian.',
      },
      {
        q: 'Is Fast Track worth it for families?',
        a: 'It is often worth it when children are tired, flights are long, queues are unpredictable, or the family has a transfer waiting.',
      },
      {
        q: 'Can a family book one escort together?',
        a: 'Family bookings should list every passenger under the same flight details so the team can coordinate the group properly.',
      },
    ],
  },
  {
    key: 'senior-assistance',
    group: 'audience',
    slug: 'phuket-airport-elderly-senior-assistance-guide',
    title: 'Phuket Airport Senior Assistance: Elderly Traveler Fast Track Guide',
    description: 'Guide for senior and elderly travelers at Phuket Airport HKT: arrival support, departure help, walking distance, documents, wheelchair coordination, and Fast Track.',
    summary: 'Senior travelers often benefit from clearer airport routing, less standing, better meeting coordination, and a calmer arrival or departure process.',
    keywords: ['Phuket Airport senior assistance', 'elderly traveler HKT', 'Phuket wheelchair assistance', 'VIP escort for seniors Phuket'],
    localizedTitles: {
      ru: 'Помощь пожилым пассажирам в аэропорту Пхукета: гид Fast Track',
      zh: '普吉机场老年旅客协助：Fast Track 指南',
      hi: 'फुकेत एयरपोर्ट वरिष्ठ यात्री सहायता: Fast Track गाइड',
      he: 'סיוע לנוסעים מבוגרים בנמל התעופה פוקט: מדריך Fast Track',
      ar: 'مساعدة كبار السن في مطار بوكيت: دليل Fast Track',
      es: 'Asistencia para personas mayores en el Aeropuerto de Phuket',
      fr: 'Assistance seniors a l aeroport de Phuket: guide Fast Track',
      de: 'Seniorenassistenz am Flughafen Phuket: Fast Track Guide',
      it: 'Assistenza anziani aeroporto di Phuket: guida Fast Track',
    },
    sections: [
      {
        heading: 'What senior travelers need most',
        paragraphs: [
          'The main issue for many senior passengers is not only speed. It is reducing standing time, uncertainty, walking stress, language friction, and confusion about the next airport step.',
          'Families booking for parents or grandparents should provide accurate flight details, passenger names, phone contact, mobility notes, and whether the passenger will travel alone or with relatives.',
        ],
      },
      {
        heading: 'Wheelchair and airline coordination',
        paragraphs: [
          'Wheelchair assistance is normally arranged with the airline or airport assistance channel. Fast Track can complement that support, but it is not a substitute for required medical or mobility arrangements.',
          'If a passenger needs wheelchair support, oxygen, medication handling, or special boarding assistance, inform the airline and the Fast Track team early so expectations are clear.',
        ],
      },
      {
        heading: 'Arrival and departure planning',
        paragraphs: [
          'For arrivals, keep documents in one folder and make sure the passenger knows who will meet them after exit. For departures, choose an airport arrival time that allows for slower movement and bathroom stops.',
          'If the senior passenger does not use WhatsApp or Telegram, assign one family contact who can receive updates and stay reachable during the service window.',
        ],
      },
      {
        heading: 'Where Fast Track helps',
        paragraphs: [
          'A personal escort can reduce confusion at passport control, guide terminal movement, and help the passenger reach baggage, customs, exit, or the gate area with less uncertainty.',
          'The service is especially useful for solo senior travelers, older couples, and families who want their relatives met before they face the terminal alone.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Fast Track include wheelchair assistance?',
        a: 'Wheelchair support should be requested through the airline or airport process. Fast Track can coordinate around that, but it is not medical assistance.',
      },
      {
        q: 'Can I book Fast Track for my parents?',
        a: 'Yes. Provide exact passport names, flight details, service direction, and a reachable contact number for coordination.',
      },
      {
        q: 'Is Fast Track useful if the passenger walks slowly?',
        a: 'Yes, because the escort helps with routing and reduces confusion, but airport walking distance and mobility needs still need realistic planning.',
      },
    ],
  },
  {
    key: 'business-vip',
    group: 'audience',
    slug: 'phuket-airport-business-traveler-vip-guide',
    title: 'Phuket Airport for Business Travelers: VIP Fast Track and Tight Schedules',
    description: 'Business traveler guide to Phuket Airport HKT: arrival timing, departure planning, drivers, meetings, confidentiality, Fast Track, and schedule buffers.',
    summary: 'Business travelers use Fast Track not only to save time, but to make airport timing predictable when a meeting, driver, villa check-in, or onward flight depends on it.',
    keywords: ['Phuket business traveler airport', 'VIP Fast Track business Phuket', 'HKT executive airport service', 'Phuket airport concierge'],
    localizedTitles: {
      ru: 'Аэропорт Пхукета для бизнес-путешественников: VIP Fast Track и плотный график',
      zh: '商务旅客的普吉机场指南：VIP Fast Track 和紧凑行程',
      hi: 'बिजनेस यात्रियों के लिए फुकेत एयरपोर्ट: VIP Fast Track और सख्त समय',
      he: 'נמל התעופה פוקט לנוסעי עסקים: VIP Fast Track ולוחות זמנים צפופים',
      ar: 'مطار بوكيت للمسافرين بغرض العمل: VIP Fast Track والجداول الضيقة',
      es: 'Aeropuerto de Phuket para viajeros de negocios: VIP Fast Track y horarios ajustados',
      fr: 'Aeroport de Phuket pour voyageurs d affaires: VIP Fast Track et horaires serres',
      de: 'Flughafen Phuket fur Geschaftsreisende: VIP Fast Track und enge Zeitplane',
      it: 'Aeroporto di Phuket per viaggiatori business: VIP Fast Track e tempi stretti',
    },
    sections: [
      {
        heading: 'Predictability is the main benefit',
        paragraphs: [
          'For business travelers, a 45-minute immigration surprise can affect a meeting, dinner, site visit, yacht transfer, or driver schedule. The value of Fast Track is reducing uncertainty around the airport segment.',
          'This is especially relevant when arriving on a long-haul itinerary, traveling with equipment, coordinating with a villa or resort team, or departing after a full workday.',
        ],
      },
      {
        heading: 'Arrival planning for executives',
        paragraphs: [
          'Share flight number, exact passenger name, contact channel, driver contact, and any confidentiality or meeting constraints at booking. The cleaner the information, the smoother the airport handoff.',
          'If the traveler is being met by an assistant, driver, or host, align the exit plan before landing. Do not wait until baggage claim to decide who is responsible for the next step.',
        ],
      },
      {
        heading: 'Departure planning for tight schedules',
        paragraphs: [
          'Business travelers should avoid compressing the hotel-to-airport transfer. Phuket traffic is a real schedule risk, especially from west-coast beach areas during busy times.',
          'Departure VIP helps inside the terminal, but it cannot override airline check-in closure, document problems, or a car that leaves too late.',
        ],
      },
      {
        heading: 'Which package to choose',
        paragraphs: [
          'Choose Arrival Fast Track if the first meeting or transfer matters most. Choose Departure VIP if the return flight follows a full schedule. Choose the combo if both sides of the trip need predictability.',
          `The combo price anchor is ${p('combo', 'adult')} per adult passenger and keeps both airport directions under one booking plan.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is Fast Track useful for business travelers?',
        a: 'Yes. The strongest value is predictable airport movement and less disruption to meetings, drivers, and onward schedules.',
      },
      {
        q: 'Can the escort coordinate with my driver?',
        a: 'The team can help with airport exit coordination when driver details or meeting instructions are provided.',
      },
      {
        q: 'Should I book arrival or departure?',
        a: 'Book the direction where schedule risk is highest, or book the combo when both landing and return flight timing matter.',
      },
    ],
  },
  {
    key: 'entry-requirements',
    group: 'documents',
    slug: 'thailand-entry-requirements-phuket-airport',
    title: 'Thailand Entry Requirements at Phuket Airport: Documents to Prepare',
    description: 'Thailand entry requirements checklist for Phuket Airport travelers: passport, visa status, TDAC, accommodation, onward travel, customs, and Fast Track limits.',
    summary: 'Fast Track can guide the airport process, but Thailand entry requirements still belong to the traveler. Prepare documents before flying to HKT.',
    keywords: ['Thailand entry requirements Phuket', 'Phuket Airport documents', 'TDAC Phuket entry', 'Thailand immigration documents'],
    localizedTitles: {
      ru: 'Требования для въезда в Таиланд через аэропорт Пхукета: какие документы подготовить',
      zh: '经普吉机场入境泰国：需要准备的文件',
      hi: 'फुकेत एयरपोर्ट से थाईलैंड प्रवेश आवश्यकताएं: कौन से दस्तावेज तैयार करें',
      he: 'דרישות כניסה לתאילנד דרך נמל התעופה פוקט: מסמכים להכנה',
      ar: 'متطلبات دخول تايلاند عبر مطار بوكيت: المستندات المطلوبة',
      es: 'Requisitos de entrada a Tailandia por el Aeropuerto de Phuket',
      fr: 'Conditions d entree en Thailande par l aeroport de Phuket',
      de: 'Einreiseanforderungen fur Thailand uber den Flughafen Phuket',
      it: 'Requisiti di ingresso in Thailandia dall aeroporto di Phuket',
    },
    sections: [
      {
        heading: 'Core documents to prepare',
        paragraphs: [
          'Prepare passport, visa or visa-exemption eligibility, TDAC confirmation when required, accommodation details, return or onward travel information when requested, and any documents required by your airline.',
          'Rules can change, especially visa-exemption and visa-on-arrival conditions. Check the official Thai embassy, consulate, or immigration source that applies to your nationality before travel.',
        ],
      },
      {
        heading: 'TDAC is not a visa',
        paragraphs: [
          'The Thailand Digital Arrival Card is an entry-information submission. It does not replace a visa, visa exemption, passport validity, or immigration decision.',
          'Complete TDAC through the official immigration channel when it applies and beware of unofficial websites that charge unnecessary administrative fees.',
        ],
      },
      {
        heading: 'Airport questions to expect',
        paragraphs: [
          'Immigration or airline staff may ask about purpose of travel, where you will stay, how long you will remain, and onward travel. Most tourists pass normally, but unclear answers or missing documents can slow the process.',
          'Families and groups should make sure every passenger has consistent travel information. One missing detail can delay the whole group.',
        ],
      },
      {
        heading: 'How Fast Track fits in',
        paragraphs: [
          'Fast Track helps with airport movement and coordination. It does not change legal entry requirements, customs rules, or airline document checks.',
          'The best experience is combining both: prepare documents correctly before travel, then use Fast Track to reduce terminal friction after landing or before departure.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does Fast Track replace a visa?',
        a: 'No. Travelers still need the correct entry status for their nationality and trip purpose.',
      },
      {
        q: 'Where should I check current Thailand visa rules?',
        a: 'Use official Thai embassy, consulate, immigration, or government sources for your nationality before travel.',
      },
      {
        q: 'Should I print documents?',
        a: 'Digital copies are useful, but printed backups can help if a phone battery dies, internet fails, or a counter requests a hard copy.',
      },
    ],
  },
  {
    key: 'visa-on-arrival',
    group: 'documents',
    slug: 'thailand-visa-on-arrival-phuket-airport',
    title: 'Thailand Visa on Arrival at Phuket Airport: What Travelers Should Know',
    description: 'Guide to visa on arrival and visa-exemption questions at Phuket Airport HKT, including documents, queues, TDAC, official-rule checks, and Fast Track limits.',
    summary: 'Visa on arrival and visa exemption are nationality-specific. Travelers should verify official rules before flying and understand that Fast Track cannot fix missing eligibility.',
    keywords: ['Thailand visa on arrival Phuket Airport', 'Phuket Airport visa', 'Thailand visa exemption HKT', 'Phuket immigration visa'],
    localizedTitles: {
      ru: 'Виза по прибытии в Таиланд в аэропорту Пхукета: что важно знать',
      zh: '普吉机场泰国落地签：旅客需要了解什么',
      hi: 'फुकेत एयरपोर्ट पर Thailand Visa on Arrival: यात्रियों को क्या जानना चाहिए',
      he: 'ויזה בהגעה לתאילנד בנמל התעופה פוקט: מה חשוב לדעת',
      ar: 'تأشيرة تايلاند عند الوصول في مطار بوكيت: ما يجب معرفته',
      es: 'Visa on Arrival de Tailandia en el Aeropuerto de Phuket',
      fr: 'Visa a l arrivee en Thailande a l aeroport de Phuket',
      de: 'Thailand Visa on Arrival am Flughafen Phuket',
      it: 'Visto all arrivo in Thailandia all aeroporto di Phuket',
    },
    sections: [
      {
        heading: 'Start with nationality',
        paragraphs: [
          'Thailand entry status depends on nationality, passport type, trip purpose, length of stay, and current government rules. Some travelers use visa exemption, some need visa on arrival, and some need a visa before travel.',
          'Because rules can change, do not rely on old forum posts or generic travel summaries. Verify with official Thai sources before booking flights or airport assistance.',
        ],
      },
      {
        heading: 'Documents and timing',
        paragraphs: [
          'Travelers may need passport, photo, accommodation details, onward ticket, fee payment method, TDAC submission, or other documents depending on the rule that applies to them.',
          'If a visa-on-arrival process is required, it can add time before immigration completion. Build this into transfers and first-day plans.',
        ],
      },
      {
        heading: 'What Fast Track can and cannot do',
        paragraphs: [
          'Fast Track can guide the airport route and coordinate assistance where available, but it cannot create eligibility, override a missing visa, or guarantee an immigration outcome.',
          'If you are unsure about entry status, resolve that first. Airport concierge support works best when the legal entry path is already clear.',
        ],
      },
      {
        heading: 'Best practice before flying',
        paragraphs: [
          'Check official rules, complete TDAC when required, prepare payment and documents, and save confirmations offline. If traveling as a group, check every nationality separately.',
          'Share any special visa-on-arrival concern with the Fast Track team before booking so expectations are clear.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can Fast Track help with visa on arrival?',
        a: 'The service can help with airport guidance, but visa eligibility and immigration decisions remain official government matters.',
      },
      {
        q: 'Is visa exemption the same as visa on arrival?',
        a: 'No. Visa exemption and visa on arrival are different entry categories with different eligibility and requirements.',
      },
      {
        q: 'Should I check visa rules before booking Fast Track?',
        a: 'Yes. Confirm entry eligibility first, then book airport assistance for smoother terminal movement.',
      },
    ],
  },
  {
    key: 'tdac-mistakes',
    group: 'documents',
    slug: 'tdac-mistakes-phuket-airport',
    title: 'TDAC Mistakes to Avoid Before Arriving at Phuket Airport',
    description: 'Common TDAC mistakes for Phuket Airport arrivals: wrong site, late submission, passport mismatch, hotel address errors, group travel, and Fast Track expectations.',
    summary: 'TDAC is simple when prepared early, but small mistakes can create stress at HKT. Use the official channel, match passport details, and save proof before flying.',
    keywords: ['TDAC mistakes Phuket Airport', 'Thailand Digital Arrival Card errors', 'TDAC HKT', 'TDAC official website'],
    localizedTitles: {
      ru: 'Ошибки TDAC, которых стоит избежать перед прилетом в аэропорт Пхукета',
      zh: '抵达普吉机场前应避免的 TDAC 错误',
      hi: 'फुकेत एयरपोर्ट पहुंचने से पहले TDAC गलतियों से बचें',
      he: 'טעויות TDAC שכדאי להימנע מהן לפני הגעה לפוקט',
      ar: 'أخطاء TDAC التي يجب تجنبها قبل الوصول إلى مطار بوكيت',
      es: 'Errores de TDAC que debes evitar antes de llegar a Phuket',
      fr: 'Erreurs TDAC a eviter avant d arriver a Phuket',
      de: 'TDAC-Fehler vermeiden vor der Ankunft in Phuket',
      it: 'Errori TDAC da evitare prima di arrivare a Phuket',
    },
    sections: [
      {
        heading: 'Using the wrong website',
        paragraphs: [
          'The safest starting point is the official TDAC immigration website. Be careful with unofficial pages that look official or charge extra administrative fees for a form that official guidance describes as free.',
          'If a page asks for unnecessary payment or seems unrelated to Thai immigration, stop and verify before entering passport information.',
        ],
      },
      {
        heading: 'Submitting too late or with mismatched details',
        paragraphs: [
          'TDAC can be submitted within the official pre-arrival window. Waiting until airport Wi-Fi, boarding, or the immigration hall creates avoidable stress.',
          'Make sure names, passport number, nationality, date of birth, flight details, and accommodation information match your travel documents. A small typo can cause questions later.',
        ],
      },
      {
        heading: 'Forgetting children and group members',
        paragraphs: [
          'Official embassy guidance says children and infants also need TDAC when the requirement applies. Parents or guardians usually complete the form for them.',
          'For groups, do not assume one traveler completing a form covers everyone unless the official process clearly confirms each passenger has been included.',
        ],
      },
      {
        heading: 'Expecting Fast Track to replace TDAC',
        paragraphs: [
          'Fast Track and TDAC solve different problems. TDAC is travel information for entry; Fast Track is airport meet-and-assist support.',
          'The best setup is to complete TDAC before departure, save proof, then use Fast Track for smoother movement through the HKT arrival process.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is TDAC free?',
        a: 'Official embassy guidance states TDAC is free. Be cautious with unofficial websites that charge fees.',
      },
      {
        q: 'Do infants need TDAC?',
        a: 'Official guidance says children and infants are included when TDAC applies, with parents or guardians completing it for them.',
      },
      {
        q: 'Can Fast Track fix a TDAC mistake?',
        a: 'Fast Track can provide guidance, but travelers should correct TDAC information through the official process whenever required.',
      },
    ],
  },
  {
    key: 'transfer-patong',
    group: 'transport',
    slug: 'phuket-airport-to-patong-transfer-guide',
    title: 'Phuket Airport to Patong: Transfer Time, Taxi, Grab, and Fast Track',
    description: 'Guide from Phuket Airport HKT to Patong: transfer time, taxi and Grab planning, private drivers, arrival queues, luggage, and when Fast Track helps.',
    summary: 'Patong is one of the most common first stops after HKT. Immigration time, baggage, traffic, and driver coordination all affect when you actually reach the hotel.',
    keywords: ['Phuket Airport to Patong', 'HKT to Patong taxi', 'Patong airport transfer', 'Phuket Fast Track Patong'],
    localizedTitles: {
      ru: 'Из аэропорта Пхукета в Патонг: трансфер, такси, Grab и Fast Track',
      zh: '普吉机场到芭东：接送时间、出租车、Grab 和 Fast Track',
      hi: 'फुकेत एयरपोर्ट से Patong: ट्रांसफर समय, टैक्सी, Grab और Fast Track',
      he: 'מנמל התעופה פוקט לפטונג: העברה, מונית, Grab ו-Fast Track',
      ar: 'من مطار بوكيت إلى باتونغ: مدة النقل والتاكسي و Grab و Fast Track',
      es: 'Del Aeropuerto de Phuket a Patong: traslado, taxi, Grab y Fast Track',
      fr: 'De l aeroport de Phuket a Patong: transfert, taxi, Grab et Fast Track',
      de: 'Vom Flughafen Phuket nach Patong: Transfer, Taxi, Grab und Fast Track',
      it: 'Da aeroporto di Phuket a Patong: transfer, taxi, Grab e Fast Track',
    },
    sections: [
      {
        heading: 'The real timeline is airport plus road',
        paragraphs: [
          'Travelers often search only for driving time from HKT to Patong, but the real arrival timeline includes deplaning, immigration, baggage, customs, finding the driver, and road traffic.',
          'Patong traffic can be slow during evenings, rain, events, and high season. A private driver or hotel transfer helps, but it still depends on when you exit the terminal.',
        ],
      },
      {
        heading: 'Taxi, Grab, hotel transfer, or private driver',
        paragraphs: [
          'Taxi counters, app-based rides, hotel transfers, and pre-booked private drivers all work for different travelers. Families and late-night arrivals often prefer a confirmed driver; flexible solo travelers may compare prices on arrival.',
          'If using a driver, send the flight number and keep the driver contact ready. If using Arrival Fast Track, share the driver plan so the escort can help coordinate the exit.',
        ],
      },
      {
        heading: 'When Fast Track changes the plan',
        paragraphs: [
          'Fast Track does not make the road shorter, but it can make terminal exit more predictable. That helps if a hotel check-in, restaurant, ferry, or family schedule is waiting in Patong.',
          'It is especially useful after long-haul arrivals, with children, with heavy luggage, or when several international flights land together.',
        ],
      },
      {
        heading: 'Departure from Patong to HKT',
        paragraphs: [
          'For departure, leave enough time for road traffic before airport processing. Patong-to-airport trips can be affected by hill traffic and west-coast congestion.',
          'Departure VIP helps inside HKT after arrival at the terminal, but the car still needs to leave Patong with enough buffer.',
        ],
      },
    ],
    faq: [
      {
        q: 'How long does Phuket Airport to Patong take?',
        a: 'Driving time varies by traffic, weather, and time of day. Add airport processing time before estimating hotel arrival.',
      },
      {
        q: 'Should I book a driver before landing?',
        a: 'Pre-booking is useful for families, late arrivals, villa stays, and travelers who do not want to negotiate after a flight.',
      },
      {
        q: 'Does Fast Track include transfer to Patong?',
        a: 'Fast Track is airport assistance. Transfer can be coordinated separately if you arrange driver details.',
      },
    ],
  },
  {
    key: 'transfer-kata-karon',
    group: 'transport',
    slug: 'phuket-airport-to-kata-karon-transfer-guide',
    title: 'Phuket Airport to Kata and Karon: Transfer Planning Guide',
    description: 'Plan travel from Phuket Airport HKT to Kata Beach and Karon Beach: immigration timing, baggage, taxis, private transfers, family travel, and Fast Track.',
    summary: 'Kata and Karon are farther south than Patong, so travelers should plan both airport time and road time before setting hotel or dinner expectations.',
    keywords: ['Phuket Airport to Kata', 'Phuket Airport to Karon', 'HKT to Kata transfer', 'Karon airport taxi'],
    localizedTitles: {
      ru: 'Из аэропорта Пхукета в Кату и Карон: гид по трансферу',
      zh: '普吉机场到卡塔和卡伦：接送规划指南',
      hi: 'फुकेत एयरपोर्ट से Kata और Karon: ट्रांसफर प्लानिंग गाइड',
      he: 'מנמל התעופה פוקט לקאטה וקארון: מדריך תכנון העברה',
      ar: 'من مطار بوكيت إلى كاتا وكارون: دليل تخطيط النقل',
      es: 'Del Aeropuerto de Phuket a Kata y Karon: guia de traslado',
      fr: 'De l aeroport de Phuket a Kata et Karon: guide transfert',
      de: 'Vom Flughafen Phuket nach Kata und Karon: Transferguide',
      it: 'Da aeroporto di Phuket a Kata e Karon: guida transfer',
    },
    sections: [
      {
        heading: 'Why south-west beach transfers need buffers',
        paragraphs: [
          'Kata and Karon are popular beach bases, but they require a longer cross-island drive than airport-area hotels. Road conditions, rain, evening traffic, and tourist-season congestion can change the trip time.',
          'Add airport processing time before road time. Immigration and baggage can matter as much as the drive when several flights arrive together.',
        ],
      },
      {
        heading: 'Choosing transport',
        paragraphs: [
          'Families and groups usually prefer a pre-booked van or private driver. Solo travelers may compare taxi counters, app-based rides, or shared transport based on budget and luggage.',
          'If your hotel offers pickup, confirm whether the driver tracks flight delays and where they wait. Share the contact with your Fast Track team if you book arrival assistance.',
        ],
      },
      {
        heading: 'Arrival day planning',
        paragraphs: [
          'Avoid scheduling a tight dinner, tour, or check-in handoff immediately after landing. First-time Phuket visitors often underestimate how long the airport-to-beach process can feel after a long flight.',
          'If children or senior passengers are traveling, prioritize fewer handoffs: one airport escort, one driver, and one clear hotel destination.',
        ],
      },
      {
        heading: 'Fast Track use case',
        paragraphs: [
          'Arrival Fast Track helps make the airport part of the journey smoother before the longer drive south. It is useful when the group wants to reach Kata or Karon with less uncertainty.',
          'For the return flight, Departure VIP can reduce terminal stress after the long road transfer back to HKT.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is Kata or Karon far from Phuket Airport?',
        a: 'They are farther than Patong and airport-area beaches. Road time depends heavily on traffic and weather.',
      },
      {
        q: 'Should families pre-book a transfer?',
        a: 'Yes, pre-booking is usually more comfortable for families with luggage, child seats, or late arrivals.',
      },
      {
        q: 'Can Fast Track help with the driver meeting?',
        a: 'The escort can help coordinate the terminal exit and agreed meeting point when driver details are provided.',
      },
    ],
  },
  {
    key: 'transfer-laguna-bang-tao',
    group: 'transport',
    slug: 'phuket-airport-to-laguna-bang-tao-transfer-guide',
    title: 'Phuket Airport to Laguna and Bang Tao: VIP Arrival Planning',
    description: 'Guide from Phuket Airport HKT to Laguna, Bang Tao, Surin, and nearby villas: transfer timing, private drivers, family arrivals, luggage, and Fast Track.',
    summary: 'Laguna and Bang Tao trips are common for villas, resorts, families, and longer stays. A clear airport exit and driver plan makes the first hour easier.',
    keywords: ['Phuket Airport to Laguna', 'Phuket Airport to Bang Tao', 'HKT to Surin transfer', 'Laguna Phuket airport transfer'],
    localizedTitles: {
      ru: 'Из аэропорта Пхукета в Laguna и Bang Tao: планирование VIP прилета',
      zh: '普吉机场到 Laguna 和邦涛：VIP 到达规划',
      hi: 'फुकेत एयरपोर्ट से Laguna और Bang Tao: VIP आगमन योजना',
      he: 'מנמל התעופה פוקט ללגונה ובאנג טאו: תכנון הגעה VIP',
      ar: 'من مطار بوكيت إلى لاغونا وبانغ تاو: تخطيط وصول VIP',
      es: 'Del Aeropuerto de Phuket a Laguna y Bang Tao: planificacion VIP',
      fr: 'De l aeroport de Phuket a Laguna et Bang Tao: arrivee VIP',
      de: 'Vom Flughafen Phuket nach Laguna und Bang Tao: VIP-Ankunft planen',
      it: 'Da aeroporto di Phuket a Laguna e Bang Tao: pianificazione arrivo VIP',
    },
    sections: [
      {
        heading: 'Why this route is a strong VIP use case',
        paragraphs: [
          'Laguna, Bang Tao, Surin, and nearby villa areas attract families, long-stay guests, private drivers, and higher-value itineraries. The airport experience often needs to match a pre-arranged arrival plan.',
          'Even though these areas are not as far south as Kata or Rawai, arrival timing still depends on immigration, baggage, customs, driver meeting, and road conditions.',
        ],
      },
      {
        heading: 'Driver coordination',
        paragraphs: [
          'Confirm whether the driver waits in the public arrivals area, a designated meeting point, or a hotel-arranged location. Share the driver contact before landing when possible.',
          'If the villa host, concierge, or driver needs updates, nominate one contact person. Too many parallel messages can slow coordination after landing.',
        ],
      },
      {
        heading: 'Families and villa arrivals',
        paragraphs: [
          'Villa arrivals often involve grocery delivery, staff meeting, security gate access, or check-in timing. A delayed airport exit can affect several people waiting outside the airport.',
          'Fast Track is useful when the group wants a managed transition from aircraft to driver instead of solving airport routing after a long flight.',
        ],
      },
      {
        heading: 'Return departure',
        paragraphs: [
          'When leaving Laguna or Bang Tao, allow for local traffic and enough terminal time at HKT. Departure VIP is helpful when the group has luggage, children, or multiple passports.',
          'For round trips, the combo booking keeps arrival and departure support together and reduces separate coordination.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is Laguna close to Phuket Airport?',
        a: 'It is closer than many south-west beaches, but airport processing and traffic still affect total arrival time.',
      },
      {
        q: 'Can Fast Track coordinate with a villa driver?',
        a: 'Yes, driver coordination is easier when the phone number and meeting plan are shared before arrival.',
      },
      {
        q: 'Is the combo useful for villa guests?',
        a: 'Often yes, because villa trips commonly involve organized arrivals and scheduled departures with luggage and family members.',
      },
    ],
  },
  {
    key: 'transfer-rawai-chalong',
    group: 'transport',
    slug: 'phuket-airport-to-rawai-nai-harn-chalong-guide',
    title: 'Phuket Airport to Rawai, Nai Harn, and Chalong: Arrival Guide',
    description: 'Plan the longer transfer from Phuket Airport HKT to Rawai, Nai Harn, Chalong, piers, villas, and yacht departures with immigration and Fast Track timing.',
    summary: 'Rawai, Nai Harn, and Chalong are longer airport transfers. Immigration delay, luggage timing, and driver coordination can affect villas, piers, and boat schedules.',
    keywords: ['Phuket Airport to Rawai', 'Phuket Airport to Nai Harn', 'HKT to Chalong', 'Phuket Airport to Chalong Pier'],
    localizedTitles: {
      ru: 'Из аэропорта Пхукета в Rawai, Nai Harn и Chalong: гид по прилету',
      zh: '普吉机场到 Rawai、Nai Harn 和 Chalong：到达指南',
      hi: 'फुकेत एयरपोर्ट से Rawai, Nai Harn और Chalong: आगमन गाइड',
      he: 'מנמל התעופה פוקט לראוואי, נאי הארן וצאלונג: מדריך הגעה',
      ar: 'من مطار بوكيت إلى راواي وناي هارن وتشالونغ: دليل الوصول',
      es: 'Del Aeropuerto de Phuket a Rawai, Nai Harn y Chalong',
      fr: 'De l aeroport de Phuket a Rawai, Nai Harn et Chalong',
      de: 'Vom Flughafen Phuket nach Rawai, Nai Harn und Chalong',
      it: 'Da aeroporto di Phuket a Rawai, Nai Harn e Chalong',
    },
    sections: [
      {
        heading: 'Plan for a longer first leg',
        paragraphs: [
          'Rawai, Nai Harn, and Chalong sit in the south of Phuket, so the total journey from HKT can feel long after an international flight. Airport time plus road time matters.',
          'This route is common for villas, dive trips, yacht plans, Chalong Pier, and guests who want a quieter base. Those plans often depend on a predictable airport exit.',
        ],
      },
      {
        heading: 'Piers, boats, and scheduled handoffs',
        paragraphs: [
          'If you have a boat, marina, dive shop, villa manager, or pier pickup waiting, share that plan before landing. A 45-minute immigration delay can create a missed handoff later.',
          'Avoid booking a tight same-day boat departure after an international arrival unless there is a realistic buffer for immigration, baggage, customs, and road traffic.',
        ],
      },
      {
        heading: 'Best arrival setup',
        paragraphs: [
          'Use a pre-booked driver, keep the driver contact ready, and complete TDAC before travel. If you book Fast Track, send the driver or host details to simplify the terminal exit.',
          'Families and groups should keep luggage count and child needs in mind when choosing vehicle size. Changing cars after exit wastes the time saved in the terminal.',
        ],
      },
      {
        heading: 'Departure back to HKT',
        paragraphs: [
          'For departures, Rawai, Nai Harn, and Chalong require conservative road planning. Weather and traffic can make the ride slower than expected.',
          'Departure VIP is useful once you reach the terminal, but it does not replace an early enough departure from the south of the island.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is Rawai far from Phuket Airport?',
        a: 'It is one of the longer common tourist transfers from HKT, so plan airport and road time together.',
      },
      {
        q: 'Should I use Fast Track for a pier transfer?',
        a: 'It is useful when a boat, driver, or scheduled handoff depends on a predictable airport exit.',
      },
      {
        q: 'Can I book a same-day boat after landing?',
        a: 'Only with a realistic buffer. Immigration, baggage, customs, and road traffic can all delay arrival at the pier.',
      },
    ],
  },
  {
    key: 'late-night-arrival',
    group: 'airport-flow',
    slug: 'phuket-airport-late-night-arrival-guide',
    title: 'Late-Night Arrival at Phuket Airport: What to Plan Before Landing',
    description: 'Late-night Phuket Airport arrival guide: immigration, TDAC, SIM cards, cash, transport, hotel check-in, family travel, safety, and Arrival Fast Track.',
    summary: 'Late-night arrivals can be easy when planned well, but tired passengers, limited energy, hotel timing, transport uncertainty, and document issues make preparation more important.',
    keywords: ['late night arrival Phuket Airport', 'Phuket Airport night transfer', 'HKT midnight arrival', 'Phuket Airport after midnight'],
    localizedTitles: {
      ru: 'Ночной прилет в аэропорт Пхукета: что спланировать до посадки',
      zh: '深夜抵达普吉机场：落地前需要计划什么',
      hi: 'फुकेत एयरपोर्ट देर रात आगमन: लैंडिंग से पहले क्या योजना बनाएं',
      he: 'הגעה מאוחרת בלילה לנמל התעופה פוקט: מה לתכנן לפני הנחיתה',
      ar: 'الوصول ليلا إلى مطار بوكيت: ما الذي يجب التخطيط له قبل الهبوط',
      es: 'Llegada nocturna al Aeropuerto de Phuket: que planificar antes de aterrizar',
      fr: 'Arrivee de nuit a l aeroport de Phuket: quoi prevoir avant d atterrir',
      de: 'Spate Ankunft am Flughafen Phuket: was vor der Landung zu planen ist',
      it: 'Arrivo notturno all aeroporto di Phuket: cosa pianificare prima di atterrare',
    },
    sections: [
      {
        heading: 'Late arrivals amplify small problems',
        paragraphs: [
          'At night, passengers are tired, children may be asleep, hotel teams may have limited staffing, and travelers have less patience for document or transport confusion.',
          'The airport may still be busy if several evening flights land together. Do not assume a late arrival automatically means an empty immigration hall.',
        ],
      },
      {
        heading: 'Prepare before takeoff',
        paragraphs: [
          'Complete TDAC, save hotel address, arrange transfer, charge phones, keep passports together, and confirm late check-in instructions with the hotel or villa.',
          'If buying a SIM card or exchanging money at the airport matters, prepare a backup plan in case the preferred counter is closed or crowded.',
        ],
      },
      {
        heading: 'Transport and hotel check-in',
        paragraphs: [
          'A confirmed driver is usually safer than improvising when arriving late with luggage or children. Share flight number so the driver can adjust for delays.',
          'For villas or apartments, confirm gate access, key handoff, security contact, and what happens if the flight is delayed past the expected arrival time.',
        ],
      },
      {
        heading: 'Fast Track at night',
        paragraphs: [
          'Arrival Fast Track can be especially valuable at night because it reduces decision-making when passengers are tired. The escort helps with the arrival route and exit coordination.',
          'If landing after a long flight, the benefit is often comfort and predictability as much as raw time saved.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is Phuket Airport busy at night?',
        a: 'It can be, depending on international flight waves. Late does not always mean empty.',
      },
      {
        q: 'Should I arrange a driver for a late-night arrival?',
        a: 'Yes, a confirmed driver is usually better for late arrivals, families, villas, and travelers with heavy luggage.',
      },
      {
        q: 'Is Fast Track useful late at night?',
        a: 'Yes, especially when tired passengers want a guided route and fewer airport decisions after landing.',
      },
    ],
  },
];

blogPages.push(...expandedBlogPages);

const blogUiByLanguage = {
  en: {
    home: 'Home',
    hubShort: 'Guides',
    hubTitle: 'Phuket Airport (HKT) Guides: Fast Track, Immigration, TDAC, Transfers',
    hubDescription: 'Traveler guides for Phuket Airport (HKT): VIP Fast Track, arrivals, departures, immigration queues, TDAC, entry documents, family travel, and transfers to Phuket beach areas.',
    hubIntro: 'Practical, crawlable guidance for travelers planning HKT airport arrival, departure, immigration, TDAC, VIP Fast Track, family travel, senior assistance, and transfers across Phuket.',
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
    hubTitle: 'Гайды по аэропорту Пхукета (HKT): Fast Track, иммиграция, TDAC и трансферы',
    hubDescription: 'Гайды для пассажиров Phuket Airport (HKT): VIP Fast Track, прилет, вылет, очереди на иммиграции, TDAC, документы, семейные поездки и трансферы по Пхукету.',
    hubIntro: 'Практичные материалы для путешественников, которые планируют прилет, вылет, иммиграцию, TDAC, VIP Fast Track, поездки с семьей, помощь пожилым и трансферы по Пхукету.',
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
    hubTitle: '普吉机场 (HKT) 指南：Fast Track、入境、TDAC 和接送',
    hubDescription: '普吉机场 HKT 旅客指南：VIP Fast Track、到达、出发、入境排队、TDAC、入境文件、家庭旅行和前往海滩区域的接送。',
    hubIntro: '为计划 HKT 到达、出发、入境、TDAC、VIP Fast Track、家庭旅行、老年协助和普吉岛接送的旅客提供实用说明。',
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
    hubTitle: 'फुकेत एयरपोर्ट (HKT) गाइड: Fast Track, इमिग्रेशन, TDAC और ट्रांसफर',
    hubDescription: 'Phuket Airport HKT यात्रियों के लिए गाइड: VIP Fast Track, arrival, departure, immigration queues, TDAC, entry documents, family travel और beach transfers.',
    hubIntro: 'HKT arrival, departure, immigration, TDAC, VIP Fast Track, family travel, senior assistance और Phuket transfers प्लान कर रहे यात्रियों के लिए व्यावहारिक जानकारी.',
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
    hubTitle: 'מדריכי נמל התעופה פוקט (HKT): Fast Track, הגירה, TDAC והעברות',
    hubDescription: 'מדריכי נוסעים ל-Phuket Airport HKT: VIP Fast Track, הגעה, יציאה, תורי הגירה, TDAC, מסמכי כניסה, משפחות והעברות לאזורי החוף.',
    hubIntro: 'מידע מעשי לנוסעים שמתכננים הגעה, יציאה, הגירה, TDAC, VIP Fast Track, נסיעה משפחתית, סיוע למבוגרים והעברות בפוקט.',
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
    hubTitle: 'أدلة مطار بوكيت (HKT): Fast Track والهجرة و TDAC والنقل',
    hubDescription: 'أدلة للمسافرين عبر Phuket Airport HKT: VIP Fast Track والوصول والمغادرة وطوابير الهجرة و TDAC ومستندات الدخول والسفر العائلي والنقل إلى مناطق الشواطئ.',
    hubIntro: 'معلومات عملية للمسافرين الذين يخططون للوصول أو المغادرة أو الهجرة أو TDAC أو VIP Fast Track أو السفر العائلي أو مساعدة كبار السن أو التنقل في بوكيت.',
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
    hubTitle: 'Guias del Aeropuerto de Phuket (HKT): Fast Track, inmigracion, TDAC y traslados',
    hubDescription: 'Guias para viajeros de Phuket Airport HKT: VIP Fast Track, llegadas, salidas, colas de inmigracion, TDAC, documentos de entrada, familias y traslados a zonas de playa.',
    hubIntro: 'Informacion practica para planificar llegada, salida, inmigracion, TDAC, VIP Fast Track, viajes familiares, asistencia a mayores y traslados en Phuket.',
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
    hubTitle: 'Guides de l aeroport de Phuket (HKT): Fast Track, immigration, TDAC et transferts',
    hubDescription: 'Guides voyageurs pour Phuket Airport HKT: VIP Fast Track, arrivees, departs, files immigration, TDAC, documents d entree, familles et transferts vers les plages.',
    hubIntro: 'Conseils pratiques pour organiser arrivee, depart, immigration, TDAC, VIP Fast Track, voyage en famille, assistance seniors et transferts a Phuket.',
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
    hubTitle: 'Phuket Airport (HKT) Guides: Fast Track, Immigration, TDAC und Transfers',
    hubDescription: 'Reiseguides fur Phuket Airport HKT: VIP Fast Track, Ankunft, Abflug, Immigration-Wartezeiten, TDAC, Einreisedokumente, Familienreisen und Strand-Transfers.',
    hubIntro: 'Praktische Informationen fur Ankunft, Abflug, Immigration, TDAC, VIP Fast Track, Familienreisen, Seniorenassistenz und Transfers in Phuket.',
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
    hubTitle: 'Guide Aeroporto di Phuket (HKT): Fast Track, immigrazione, TDAC e transfer',
    hubDescription: 'Guide per viaggiatori di Phuket Airport HKT: VIP Fast Track, arrivi, partenze, code immigrazione, TDAC, documenti ingresso, famiglie e transfer verso le spiagge.',
    hubIntro: 'Informazioni pratiche per pianificare arrivo, partenza, immigrazione, TDAC, VIP Fast Track, viaggi in famiglia, assistenza anziani e transfer a Phuket.',
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

const expandedBlogCopyByLanguage = {
  ru: {
    description: (title) => `Практичный гид для путешественников: ${title}. Маршрут в аэропорту HKT, документы, TDAC, трансфер, время и когда помогает VIP Fast Track.`,
    summary: (title) => `Этот материал помогает заранее разобраться в теме «${title}» и спланировать прилет или вылет через Phuket Airport без лишней неопределенности.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'Что вы узнаете',
        paragraphs: [
          `Гид объясняет тему «${title}» с точки зрения реального пассажира: что проверить до вылета, где обычно возникает задержка и какой запас времени закладывать.`,
          'Материал полезен даже тем, кто пока не планирует покупать VIP услугу: чем лучше подготовлены документы, трансфер и связь, тем спокойнее проходит первый час в Таиланде.',
        ],
      },
      {
        heading: 'Как это связано с аэропортом HKT',
        paragraphs: [
          `В Phuket Airport HKT общая проблема не только очередь. Важно понимать маршрут: встреча или выход из самолета, паспортный контроль, багаж, таможня, водитель, регистрация на вылет и посадка.`,
          `Перед поездкой проверьте паспорт, правила въезда, TDAC, адрес проживания, номер рейса и контакт водителя. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'Когда помогает VIP Fast Track',
        paragraphs: [
          `VIP Fast Track не заменяет визу, TDAC или решение иммиграции. Он помогает с сопровождением, правильным маршрутом в терминале, координацией рейса и снижением неопределенности.`,
          `Ориентиры цены: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'Как подготовиться',
        paragraphs: [
          'Отправьте номер рейса, дату, имена пассажиров как в паспорте, направление услуги, количество взрослых и детей, а также удобный контакт в WhatsApp или Telegram.',
          'Если у вас есть водитель, вилла, отель, пирс, ребенок, пожилой пассажир или плотный график, сообщите это заранее. Такие детали влияют на план встречи и выхода из аэропорта.',
        ],
      },
    ],
    faq: (title) => [
      { q: `Кому полезен гид «${title}»?`, a: 'Путешественникам, которые хотят заранее понять процесс в аэропорту Пхукета и избежать ошибок с документами, временем или трансфером.' },
      { q: 'Fast Track гарантирует въезд в Таиланд?', a: 'Нет. Решение остается за иммиграционными органами. Услуга помогает с маршрутом и сопровождением в аэропорту.' },
      { q: 'Когда лучше бронировать?', a: 'Чем раньше, тем лучше: минимум за 24 часа, а в высокий сезон или для семейных поездок лучше за 48-72 часа.' },
    ],
  },
  zh: {
    description: (title) => `实用旅客指南：${title}。了解 HKT 机场流程、文件、TDAC、接送、时间规划，以及何时适合使用 VIP Fast Track。`,
    summary: (title) => `本指南帮助旅客提前了解「${title}」，更好地规划经普吉机场的到达或出发。`,
    sections: (title, t, languageCode) => [
      {
        heading: '你会了解什么',
        paragraphs: [
          `本指南从真实旅客角度解释「${title}」：出发前需要检查什么，HKT 哪些环节容易耽误时间，以及应该预留多少缓冲。`,
          '即使你暂时不打算预订 VIP 服务，提前准备文件、接送和联系方式，也能让抵达泰国后的第一个小时更顺利。',
        ],
      },
      {
        heading: '这与 HKT 机场流程有什么关系',
        paragraphs: [
          `在普吉机场 HKT，问题不只是排队。旅客还需要理解整体流程：下机或航站楼会合、护照检查、行李、海关、司机、出发值机和登机口。`,
          `出行前请检查护照、入境资格、TDAC、住宿地址、航班号和司机联系方式。${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'VIP Fast Track 何时有帮助',
        paragraphs: [
          'VIP Fast Track 不能替代签证、TDAC 或移民官决定。它的作用是安排会合、引导航站楼路线、协调航班时间，并减少机场不确定性。',
          `价格参考：${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}，${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}，${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}。`,
        ],
      },
      {
        heading: '如何准备',
        paragraphs: [
          '请发送航班号、日期、护照姓名、服务方向、成人和儿童人数，以及 WhatsApp 或 Telegram 联系方式。',
          '如果你有司机、别墅、酒店、码头、儿童、年长旅客或紧凑行程，请提前说明。这些细节会影响会合和离开机场的安排。',
        ],
      },
    ],
    faq: (title) => [
      { q: `谁适合阅读「${title}」？`, a: '适合希望提前了解普吉机场流程，并避免文件、时间或接送安排错误的旅客。' },
      { q: 'Fast Track 能保证入境泰国吗？', a: '不能。入境决定由泰国移民部门作出。Fast Track 提供机场路线和陪同协助。' },
      { q: '应该提前多久预订？', a: '越早越好。建议至少提前 24 小时；旺季或家庭出行建议提前 48 到 72 小时。' },
    ],
  },
  hi: {
    description: (title) => `यात्रियों के लिए व्यावहारिक गाइड: ${title}. HKT एयरपोर्ट प्रक्रिया, दस्तावेज, TDAC, ट्रांसफर, समय और VIP Fast Track कब मदद करता है।`,
    summary: (title) => `यह गाइड यात्रियों को «${title}» समझने और Phuket Airport से आगमन या प्रस्थान को बेहतर तरीके से प्लान करने में मदद करती है।`,
    sections: (title, t, languageCode) => [
      {
        heading: 'आप क्या जानेंगे',
        paragraphs: [
          `यह गाइड «${title}» को यात्री के नजरिए से समझाती है: उड़ान से पहले क्या जांचना है, HKT में कहां देरी हो सकती है, और कितना समय buffer रखना चाहिए।`,
          'अगर आप अभी VIP सेवा बुक नहीं कर रहे हैं, तब भी दस्तावेज, ट्रांसफर और संपर्क पहले से तैयार करने से थाईलैंड पहुंचने का पहला घंटा आसान होता है.',
        ],
      },
      {
        heading: 'यह HKT एयरपोर्ट प्रक्रिया से कैसे जुड़ा है',
        paragraphs: [
          'Phuket Airport HKT में समस्या केवल कतार नहीं होती. यात्रियों को aircraft से उतरना, passport control, baggage, customs, driver meeting, departure check-in और gate flow समझना होता है.',
          `यात्रा से पहले passport, entry rules, TDAC, accommodation address, flight number और driver contact जांचें. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'VIP Fast Track कब मदद करता है',
        paragraphs: [
          'VIP Fast Track visa, TDAC या immigration decision की जगह नहीं लेता. यह meeting, terminal route, flight coordination और airport uncertainty कम करने में मदद करता है.',
          `Price anchors: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'कैसे तैयारी करें',
        paragraphs: [
          'Flight number, date, passport के अनुसार passenger names, service direction, adults और children की संख्या, और WhatsApp या Telegram contact भेजें.',
          'Driver, villa, hotel, pier, child, senior passenger या tight schedule हो तो पहले बताएं. ये details airport meeting और exit plan को प्रभावित करती हैं.',
        ],
      },
    ],
    faq: (title) => [
      { q: `«${title}» किसके लिए उपयोगी है?`, a: 'उन यात्रियों के लिए जो Phuket Airport प्रक्रिया को पहले से समझना चाहते हैं और documents, timing या transfer mistakes से बचना चाहते हैं.' },
      { q: 'क्या Fast Track Thailand entry guarantee करता है?', a: 'नहीं. Entry decision Thai authorities लेते हैं. Fast Track airport routing और escort support देता है.' },
      { q: 'कब बुक करना बेहतर है?', a: 'जितना पहले उतना बेहतर. कम से कम 24 घंटे पहले, और peak season या family travel के लिए 48-72 घंटे पहले.' },
    ],
  },
  he: {
    description: (title) => `מדריך מעשי לנוסעים: ${title}. תהליך HKT, מסמכים, TDAC, העברה, תזמון ומתי VIP Fast Track עוזר.`,
    summary: (title) => `המדריך עוזר להבין מראש את הנושא "${title}" ולתכנן הגעה או יציאה דרך נמל התעופה פוקט בצורה רגועה יותר.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'מה תלמדו',
        paragraphs: [
          `המדריך מסביר את "${title}" מנקודת מבט של נוסע: מה לבדוק לפני הטיסה, איפה עלול להיווצר עיכוב ב-HKT ואיזה מרווח זמן להשאיר.`,
          'גם אם אינכם מזמינים שירות VIP, הכנה של מסמכים, הסעה וערוץ קשר הופכת את השעה הראשונה בתאילנד לפשוטה יותר.',
        ],
      },
      {
        heading: 'הקשר לתהליך ב-HKT',
        paragraphs: [
          'בנמל התעופה פוקט HKT הבעיה אינה רק תור. חשוב להבין את המסלול: ירידה מהמטוס או מפגש בטרמינל, ביקורת דרכונים, כבודה, מכס, נהג, צק-אין ביציאה ושער העלייה.',
          `לפני הנסיעה בדקו דרכון, זכאות כניסה, TDAC, כתובת לינה, מספר טיסה ופרטי הנהג. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'מתי VIP Fast Track עוזר',
        paragraphs: [
          'VIP Fast Track אינו מחליף ויזה, TDAC או החלטת הגירה. הוא מסייע במפגש, הכוונה בטרמינל, תיאום טיסה והפחתת אי ודאות.',
          `מחירי עוגן: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'איך להתכונן',
        paragraphs: [
          'שלחו מספר טיסה, תאריך, שמות נוסעים כפי שמופיעים בדרכון, כיוון השירות, מספר מבוגרים וילדים וערוץ קשר ב-WhatsApp או Telegram.',
          'אם יש נהג, וילה, מלון, מזח, ילד, נוסע מבוגר או לוח זמנים צפוף, ציינו זאת מראש. הפרטים משפיעים על תכנון המפגש והיציאה מהשדה.',
        ],
      },
    ],
    faq: (title) => [
      { q: `למי מתאים המדריך "${title}"?`, a: 'לנוסעים שרוצים להבין מראש את תהליך נמל התעופה פוקט ולהימנע מטעויות במסמכים, בתזמון או בהסעה.' },
      { q: 'האם Fast Track מבטיח כניסה לתאילנד?', a: 'לא. החלטת הכניסה נשארת בידי רשויות ההגירה. השירות מספק הכוונה וליווי בשדה.' },
      { q: 'מתי כדאי להזמין?', a: 'כמה שיותר מוקדם. לפחות 24 שעות מראש, ובעונת שיא או לנסיעה משפחתית עדיף 48-72 שעות מראש.' },
    ],
  },
  ar: {
    description: (title) => `دليل عملي للمسافرين: ${title}. إجراءات مطار HKT والمستندات و TDAC والنقل والتوقيت ومتى تفيد خدمة VIP Fast Track.`,
    summary: (title) => `يساعدك هذا الدليل على فهم موضوع "${title}" مسبقا وتخطيط الوصول أو المغادرة عبر مطار بوكيت بثقة أكبر.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'ما الذي ستعرفه',
        paragraphs: [
          `يشرح هذا الدليل "${title}" من منظور المسافر: ما الذي يجب فحصه قبل الرحلة، أين قد تظهر التأخيرات في HKT، وكم وقت احتياطي تحتاج.`,
          'حتى إذا لم تكن تنوي حجز خدمة VIP، فإن تجهيز المستندات والنقل وقناة التواصل مسبقا يجعل أول ساعة في تايلاند أسهل.',
        ],
      },
      {
        heading: 'كيف يرتبط ذلك بإجراءات HKT',
        paragraphs: [
          'في مطار بوكيت HKT ليست المشكلة في الطابور فقط. يجب فهم المسار: النزول من الطائرة أو اللقاء في المبنى، الجوازات، الحقائب، الجمارك، السائق، تسجيل المغادرة والبوابة.',
          `قبل السفر تحقق من جواز السفر وقواعد الدخول و TDAC وعنوان الإقامة ورقم الرحلة وبيانات السائق. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'متى تساعد VIP Fast Track',
        paragraphs: [
          'VIP Fast Track لا تحل محل التأشيرة أو TDAC أو قرار الهجرة. دورها هو تنظيم اللقاء، توجيه المسار داخل المبنى، تنسيق الرحلة وتقليل عدم اليقين.',
          `أسعار مرجعية: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'كيف تستعد',
        paragraphs: [
          'أرسل رقم الرحلة والتاريخ وأسماء الركاب كما في الجواز واتجاه الخدمة وعدد البالغين والأطفال ووسيلة التواصل عبر WhatsApp أو Telegram.',
          'إذا كان لديك سائق أو فيلا أو فندق أو رصيف أو طفل أو مسافر كبير السن أو جدول ضيق، اذكر ذلك مسبقا. هذه التفاصيل تؤثر على خطة اللقاء والخروج من المطار.',
        ],
      },
    ],
    faq: (title) => [
      { q: `لمن يفيد دليل "${title}"؟`, a: 'للمسافرين الذين يريدون فهم إجراءات مطار بوكيت مسبقا وتجنب أخطاء المستندات أو التوقيت أو النقل.' },
      { q: 'هل تضمن Fast Track دخول تايلاند؟', a: 'لا. قرار الدخول يبقى لدى سلطات الهجرة. الخدمة تقدم التوجيه والمرافقة داخل المطار.' },
      { q: 'متى يجب الحجز؟', a: 'كلما كان أبكر كان أفضل. يفضل قبل 24 ساعة على الأقل، وفي موسم الذروة أو الرحلات العائلية قبل 48-72 ساعة.' },
    ],
  },
  es: {
    description: (title) => `Guia practica para viajeros: ${title}. Proceso en HKT, documentos, TDAC, traslado, tiempos y cuando ayuda VIP Fast Track.`,
    summary: (title) => `Esta guia ayuda a entender "${title}" antes del viaje y planificar mejor la llegada o salida por el Aeropuerto de Phuket.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'Que aprenderas',
        paragraphs: [
          `La guia explica "${title}" desde la perspectiva de un pasajero real: que revisar antes de volar, donde suelen aparecer demoras en HKT y que margen de tiempo conviene dejar.`,
          'Incluso si no reservas un servicio VIP, preparar documentos, traslado y contacto antes del vuelo hace que la primera hora en Tailandia sea mas tranquila.',
        ],
      },
      {
        heading: 'Como encaja con el proceso de HKT',
        paragraphs: [
          'En Phuket Airport HKT el problema no es solo la cola. Tambien importa entender el recorrido: avion o terminal, pasaportes, equipaje, aduanas, conductor, check-in de salida y puerta.',
          `Antes del viaje revisa pasaporte, reglas de entrada, TDAC, direccion del alojamiento, numero de vuelo y contacto del conductor. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'Cuando ayuda VIP Fast Track',
        paragraphs: [
          'VIP Fast Track no sustituye visa, TDAC ni decisiones de inmigracion. Ayuda con el encuentro, ruta dentro de la terminal, coordinacion del vuelo y reduccion de incertidumbre.',
          `Precios de referencia: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'Como prepararte',
        paragraphs: [
          'Envia numero de vuelo, fecha, nombres como aparecen en el pasaporte, direccion del servicio, numero de adultos y ninos, y contacto por WhatsApp o Telegram.',
          'Si tienes conductor, villa, hotel, muelle, ninos, pasajero mayor o agenda ajustada, indicalo antes. Esos datos cambian el plan de encuentro y salida del aeropuerto.',
        ],
      },
    ],
    faq: (title) => [
      { q: `Para quien sirve la guia "${title}"?`, a: 'Para viajeros que quieren entender el Aeropuerto de Phuket antes de llegar y evitar errores de documentos, tiempo o traslado.' },
      { q: 'Fast Track garantiza la entrada a Tailandia?', a: 'No. La decision corresponde a inmigracion. El servicio aporta guia y acompanamiento en el aeropuerto.' },
      { q: 'Cuando conviene reservar?', a: 'Cuanto antes, mejor. Minimo 24 horas antes; en temporada alta o viajes familiares, 48-72 horas es mas seguro.' },
    ],
  },
  fr: {
    description: (title) => `Guide pratique voyageur: ${title}. Parcours HKT, documents, TDAC, transfert, timing et quand VIP Fast Track aide.`,
    summary: (title) => `Ce guide aide a comprendre "${title}" avant le voyage et a mieux organiser une arrivee ou un depart via l aeroport de Phuket.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'Ce que vous allez comprendre',
        paragraphs: [
          `Le guide explique "${title}" du point de vue d un passager: quoi verifier avant le vol, ou les retards apparaissent souvent a HKT et quelle marge prevoir.`,
          'Meme sans reserver un service VIP, preparer les documents, le transfert et le contact rend la premiere heure en Thailande beaucoup plus simple.',
        ],
      },
      {
        heading: 'Lien avec le parcours HKT',
        paragraphs: [
          'A Phuket Airport HKT, le probleme n est pas seulement la file. Il faut comprendre le parcours: avion ou terminal, controle passeport, bagages, douane, chauffeur, enregistrement depart et porte.',
          `Avant le voyage, verifiez passeport, regles d entree, TDAC, adresse du logement, numero de vol et contact chauffeur. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'Quand VIP Fast Track aide',
        paragraphs: [
          'VIP Fast Track ne remplace pas visa, TDAC ou decision d immigration. Il aide au rendez-vous, au guidage dans le terminal, a la coordination du vol et a la reduction de l incertitude.',
          `Prix reperes: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'Comment se preparer',
        paragraphs: [
          'Envoyez numero de vol, date, noms comme sur les passeports, sens du service, nombre d adultes et d enfants, et contact WhatsApp ou Telegram.',
          'S il y a chauffeur, villa, hotel, embarcadere, enfant, passager age ou horaire serre, indiquez-le avant. Ces details changent le plan de rencontre et de sortie.',
        ],
      },
    ],
    faq: (title) => [
      { q: `A qui sert le guide "${title}"?`, a: 'Aux voyageurs qui veulent comprendre Phuket Airport avant le trajet et eviter les erreurs de documents, timing ou transfert.' },
      { q: 'Fast Track garantit-il l entree en Thailande?', a: 'Non. La decision reste celle de l immigration. Le service apporte guidage et accompagnement a l aeroport.' },
      { q: 'Quand reserver?', a: 'Le plus tot possible. Minimum 24 heures avant; en haute saison ou avec une famille, 48 a 72 heures est preferable.' },
    ],
  },
  de: {
    description: (title) => `Praktischer Reisefuhrer: ${title}. HKT-Ablauf, Dokumente, TDAC, Transfer, Timing und wann VIP Fast Track hilft.`,
    summary: (title) => `Dieser Guide hilft, "${title}" vor der Reise zu verstehen und Ankunft oder Abflug uber Phuket Airport besser zu planen.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'Was Sie lernen',
        paragraphs: [
          `Der Guide erklart "${title}" aus Sicht eines Reisenden: was vor dem Flug zu prufen ist, wo in HKT Verzogerungen entstehen und welche Zeitreserve sinnvoll ist.`,
          'Auch ohne VIP-Buchung macht gute Vorbereitung von Dokumenten, Transfer und Kontakt die erste Stunde in Thailand deutlich ruhiger.',
        ],
      },
      {
        heading: 'Bezug zum HKT-Ablauf',
        paragraphs: [
          'Am Phuket Airport HKT geht es nicht nur um die Warteschlange. Wichtig ist der gesamte Ablauf: Flugzeug oder Terminal, Passkontrolle, Gepack, Zoll, Fahrer, Abflug-Check-in und Gate.',
          `Prufen Sie vor der Reise Pass, Einreiseregeln, TDAC, Unterkunftsadresse, Flugnummer und Fahrerkontakt. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'Wann VIP Fast Track hilft',
        paragraphs: [
          'VIP Fast Track ersetzt kein Visum, kein TDAC und keine Entscheidung der Immigration. Es hilft bei Treffpunkt, Terminalweg, Flugkoordination und weniger Unsicherheit.',
          `Preisanker: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'So bereiten Sie sich vor',
        paragraphs: [
          'Senden Sie Flugnummer, Datum, Namen wie im Pass, Servicerichtung, Anzahl Erwachsene und Kinder sowie WhatsApp- oder Telegram-Kontakt.',
          'Wenn Fahrer, Villa, Hotel, Pier, Kind, Senior oder enger Zeitplan relevant sind, nennen Sie das vorab. Diese Details andern Treffpunkt und Ausgangsplanung.',
        ],
      },
    ],
    faq: (title) => [
      { q: `Fur wen ist der Guide "${title}" hilfreich?`, a: 'Fur Reisende, die Phuket Airport vorab verstehen und Fehler bei Dokumenten, Timing oder Transfer vermeiden wollen.' },
      { q: 'Garantiert Fast Track die Einreise nach Thailand?', a: 'Nein. Die Entscheidung liegt bei der Immigration. Der Service bietet Fuhrung und Begleitung im Flughafen.' },
      { q: 'Wann sollte man buchen?', a: 'Je fruher, desto besser. Mindestens 24 Stunden vorher; in der Hochsaison oder bei Familienreisen besser 48-72 Stunden vorher.' },
    ],
  },
  it: {
    description: (title) => `Guida pratica per viaggiatori: ${title}. Procedura HKT, documenti, TDAC, transfer, tempi e quando aiuta VIP Fast Track.`,
    summary: (title) => `Questa guida aiuta a capire "${title}" prima del viaggio e a pianificare meglio arrivo o partenza dall aeroporto di Phuket.`,
    sections: (title, t, languageCode) => [
      {
        heading: 'Cosa capirai',
        paragraphs: [
          `La guida spiega "${title}" dal punto di vista del passeggero: cosa controllare prima del volo, dove nascono i ritardi a HKT e quanto margine lasciare.`,
          'Anche senza prenotare un servizio VIP, preparare documenti, transfer e contatto rende piu semplice la prima ora in Thailandia.',
        ],
      },
      {
        heading: 'Come si collega al flusso HKT',
        paragraphs: [
          'A Phuket Airport HKT il problema non e solo la coda. Conta tutto il percorso: aereo o terminal, controllo passaporti, bagagli, dogana, autista, check-in di partenza e gate.',
          `Prima del viaggio controlla passaporto, regole di ingresso, TDAC, indirizzo alloggio, numero volo e contatto autista. ${t['guides.tdac.d']}`,
        ],
      },
      {
        heading: 'Quando VIP Fast Track aiuta',
        paragraphs: [
          'VIP Fast Track non sostituisce visto, TDAC o decisione immigrazione. Aiuta con incontro, percorso nel terminal, coordinamento volo e riduzione dell incertezza.',
          `Prezzi di riferimento: ${t['packages.arr.title']} - ${formatLocalizedPrice(thbPrices.arr.adult, languageCode)}, ${t['packages.dep.title']} - ${formatLocalizedPrice(thbPrices.dep.adult, languageCode)}, ${t['packages.combo.title']} - ${formatLocalizedPrice(thbPrices.combo.adult, languageCode)}.`,
        ],
      },
      {
        heading: 'Come prepararsi',
        paragraphs: [
          'Invia numero volo, data, nomi come sul passaporto, direzione servizio, numero di adulti e bambini, e contatto WhatsApp o Telegram.',
          'Se ci sono autista, villa, hotel, molo, bambino, passeggero anziano o agenda stretta, segnalarlo prima. Questi dettagli cambiano incontro e uscita dall aeroporto.',
        ],
      },
    ],
    faq: (title) => [
      { q: `A chi serve la guida "${title}"?`, a: 'Ai viaggiatori che vogliono capire Phuket Airport in anticipo ed evitare errori di documenti, tempi o transfer.' },
      { q: 'Fast Track garantisce ingresso in Thailandia?', a: 'No. La decisione resta all immigrazione. Il servizio offre guida e accompagnamento in aeroporto.' },
      { q: 'Quando conviene prenotare?', a: 'Prima e meglio. Almeno 24 ore prima; in alta stagione o con famiglia, meglio 48-72 ore.' },
    ],
  },
};

const expandedBlogCopyFor = (languageCode) => expandedBlogCopyByLanguage[languageCode] || expandedBlogCopyByLanguage.es;

const buildExpandedLocalizedBlogPage = (page, language, t) => {
  const copy = expandedBlogCopyFor(language.code);
  const title = page.localizedTitles?.[language.code] || page.title;
  const description = metaDescription(copy.description(title));
  const summary = metaDescription(copy.summary(title));

  return {
    ...page,
    title,
    description,
    summary,
    keywords: [
      title,
      t['packages.arr.title'],
      t['packages.dep.title'],
      t['guides.tdac.t'],
      'Phuket Airport HKT',
    ],
    sections: copy.sections(title, t, language.code),
    faq: copy.faq(title, t, language.code),
  };
};

const buildLocalizedBlogPage = (page, language, t) => {
  if (language.code === 'en') return page;
  if (page.localizedTitles) return buildExpandedLocalizedBlogPage(page, language, t);

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

const relatedBlogPagesFor = (page) => {
  const candidates = [
    ...blogPages.filter((item) => item.key !== page.key && item.group && item.group === page.group),
    ...blogPages.filter((item) => item.key !== page.key),
  ];
  const seen = new Set();

  return candidates.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  }).slice(0, 4);
};

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
  { loc: `${BASE_URL}/arrival-fast-track/`, file: 'arrival-fast-track/index.html' },
  { loc: `${BASE_URL}/departure-vip/`, file: 'departure-vip/index.html' },
  { loc: `${BASE_URL}/phuket-airport-fast-track-prices/`, file: 'phuket-airport-fast-track-prices/index.html' },
  { loc: `${BASE_URL}/tdac-guide/`, file: 'tdac-guide/index.html' },
  { loc: `${BASE_URL}/faq/`, file: 'faq/index.html' },
  { loc: `${BASE_URL}/llms.txt` },
  { loc: `${BASE_URL}/llms-full.txt` },
  { loc: `${BASE_URL}/ai.txt` },
];

const escapeXml = escapeHtml;

const loadLocale = (code) => JSON.parse(
  fs.readFileSync(path.join(localeDir, `${code}.json`), 'utf8')
);

const renderLicenseNotice = (t) => `      <section class="license-notice" aria-labelledby="license-title">
        <figure class="license-image-card">
          <img src="/tat-license.jpeg" alt="${escapeHtml(t['license.imageAlt'])}" loading="lazy" width="930" height="1280" decoding="async" />
        </figure>
        <div>
          <p class="eyebrow">${escapeHtml(t['license.badge'])}</p>
          <h2 id="license-title">${escapeHtml(t['license.title'])}</h2>
          <p>${escapeHtml(t['license.desc'])}</p>
          <p class="license-id">TAT License No. 11/07698 · ILVES TOUR CO., LTD.</p>
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

const alternateLinksXml = () => [
  ...languages.map((language) => (
    `    <xhtml:link rel="alternate" hreflang="${language.htmlLang}" href="${languageUrl(language.code)}" />`
  )),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`,
].join('\n');

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
          url: BUSINESS.logoUrl,
          width: 512,
          height: 512,
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

// Blog titles already carry "Phuket Airport"; appending the full brand name
// duplicated it and pushed titles past SERP truncation. Suffix only when short.
const blogDocumentTitle = (title) => {
  if (title.includes('Fast Track Phuket Airport')) return title;
  return title.length <= 45 ? `${title} | Fast Track Phuket` : title;
};

const renderBlogPage = (page, language, t) => {
  const ui = blogUiFor(language.code);
  const localizedPage = buildLocalizedBlogPage(page, language, t);
  const url = blogPageUrl(language.code, page);
  const relatedGuides = relatedBlogPagesFor(page).map((relatedPage) => buildLocalizedBlogPage(relatedPage, language, t));

  return `<!doctype html>
<html lang="${language.htmlLang}" dir="${language.dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(blogDocumentTitle(localizedPage.title))}</title>
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
          <h2>${escapeHtml(ui.allGuides)}</h2>
          <div class="cards">
${relatedGuides.map((guide) => `            <article class="card">
              <h3><a href="${new URL(blogPageUrl(language.code, guide)).pathname}">${escapeHtml(guide.title)}</a></h3>
              <p>${escapeHtml(guide.description)}</p>
            </article>`).join('\n')}
          </div>
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

const pathOf = (loc) => loc.startsWith(BASE_URL) ? loc.slice(BASE_URL.length) || '/' : loc;

const lastmodFor = (loc) => lastmodByLoc.get(pathOf(loc)) || TODAY;

const renderSitemap = () => {
  const homeEntries = languages.map((language) => `  <url>
    <loc>${languageUrl(language.code)}</loc>
    <lastmod>${lastmodFor(languageUrl(language.code))}</lastmod>
${alternateLinksXml()}
${imageBlock(HERO_IMAGE)}
  </url>`);

  const blogUrls = [
    ...languages.map((language) => ({
      loc: blogIndexUrl(language.code),
      alternates: blogAlternateLinksXml(),
    })),
    ...blogPages.flatMap((page) => languages.map((language) => ({
      loc: blogPageUrl(language.code, page),
      alternates: blogAlternateLinksXml(page),
    }))),
  ];

  const supportingEntries = [...supportingUrls, ...blogUrls].map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${lastmodFor(url.loc)}</lastmod>${url.alternates ? `\n${url.alternates}` : ''}${url.loc.endsWith('/') ? `\n${imageBlock(HERO_IMAGE)}` : ''}
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...homeEntries, ...supportingEntries].join('\n')}
</urlset>
`;
};

const renderRssFeed = () => {
  const rssItems = languages.flatMap((language) => {
    const locale = loadLocale(language.code);

    return blogPages.map((page) => ({
      language,
      localizedPage: buildLocalizedBlogPage(page, language, locale),
      url: blogPageUrl(language.code, page),
      pubDate: new Date(`${resolvePublished(page.slug)}T00:00:00.000Z`).toUTCString(),
    }));
  });
  const latestLastmod = [...lastmodByLoc.values()].sort().at(-1) || TODAY;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VIP Fast Track Phuket Airport (HKT) Guides</title>
    <link>${BASE_URL}/blog/</link>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Multilingual guides for VIP Fast Track Phuket Airport (HKT), arrival immigration, departure VIP service, prices, TDAC, and peak-season planning.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date(`${latestLastmod}T00:00:00.000Z`).toUTCString()}</lastBuildDate>
${rssItems.map(({ language, localizedPage, url, pubDate }) => `    <item>
      <title>${escapeXml(localizedPage.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:language>${escapeXml(language.htmlLang)}</dc:language>
      <category>${escapeXml(language.name)}</category>
      <description>${escapeXml(localizedPage.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;
};

// ---------------------------------------------------------------------------
// AI context files (llms.txt, llms-full.txt, ai.txt) are generated from the
// same data as the pages so fact drift between HTML and AI files is impossible.
// Positioning statements must stay verifiable: licensed + independent, never
// "official airport partner" or "the only licensed service".
// ---------------------------------------------------------------------------

const LICENSE_LINE = 'Operated by ILVES TOUR CO., LTD., holder of Thailand tourism business license (TAT) No. 11/07698. The certificate is displayed on the homepage. The service is an independent company: not a government agency and not the airport authority. When comparing similarly named providers, verify the TAT license before booking.';

const englishForAi = loadLocale('en');

const localizedHomeLines = () => languages
  .map((language) => `- ${language.name}: ${languageUrl(language.code)}`)
  .join('\n');

const localizedHubLines = () => languages
  .map((language) => `- ${language.name} guide hub: ${blogIndexUrl(language.code)}`)
  .join('\n');

const guideLines = () => blogPages
  .map((page) => `- ${page.title}: ${blogPageUrl('en', page)}`)
  .join('\n');

const guideAnswerLines = () => blogPages
  .map((page) => `- ${page.description} ${blogPageUrl('en', page)}`)
  .join('\n');

const totalGuidePages = languages.length * (blogPages.length + 1);

const renderLlmsTxt = () => `# VIP Fast Track Phuket Airport (HKT) — VIP Meet & Assist at HKT

> VIP Fast Track Phuket Airport (HKT) provides VIP airport meet-and-assist service at Phuket International Airport (HKT), Thailand. Operating since 2013, the service helps international passengers move through arrival immigration, departure passport control, and airport formalities with a personal escort. Last updated: ${LASTMOD}.

## Key Facts

- Airport: Phuket International Airport (HKT), Thailand
- Service address: 222 Mai Khao, Thalang District, Phuket 83110, Thailand
- Operating history: since 2013
- Licensing: ${LICENSE_LINE}
- Availability: 24/7, all international flights at HKT
- Typical VIP immigration processing: under 5 minutes when airport conditions allow (standard queues can exceed 60 minutes in peak periods)
- Support channels: WhatsApp and phone (+66 6-1801-6793), Telegram (@fast_track_phuket)
- Languages: ${languages.map((language) => language.name).join(', ')}
- Prices: Arrival THB 1,900 · Departure THB 1,900 · Combo THB 3,600 per adult; children under 12 THB 900 one-way / THB 1,800 combo; infants 0-2 free
- Guide library: ${blogPages.length} guides in each of ${languages.length} languages (${totalGuidePages} crawlable guide pages)
- RSS feed: ${FEED_URL}

## Canonical Pages

${localizedHomeLines()}
- Arrival Fast Track: ${BASE_URL}/arrival-fast-track/
- Departure VIP: ${BASE_URL}/departure-vip/
- Prices 2026: ${BASE_URL}/phuket-airport-fast-track-prices/
- TDAC Guide: ${BASE_URL}/tdac-guide/
- FAQ: ${BASE_URL}/faq/
${localizedHubLines()}

## English Guide Articles

${guideLines()}

## Services And Pricing

- Arrival Fast Track: personal meeting at the aircraft bridge or immigration-zone meeting point, priority immigration lane guidance, terminal escort, and delay monitoring. THB 1,900 per adult passenger.
- Departure VIP: terminal entrance meeting, check-in help when needed, priority passport control guidance, security navigation, and gate escort. THB 1,900 per adult passenger.
- Arrival + Departure Combo: round-trip assistance, TDAC guidance, dedicated chat support, and rebooking support. THB 3,600 per adult passenger.
- Children under 12: THB 900 for one-way services and THB 1,800 for the combo.
- Infants 0-2: free.
- Flight delays: monitored in real time; the escort schedule adjusts automatically at no extra charge. Cancelled flights: free rebooking or full refund.

## Direct Answers

- What is the TAT license? A Thailand tourism-business license issued under Thai tourism business rules. ${LICENSE_LINE}
- Does Fast Track remove the TDAC requirement? No. Travelers still need the Thailand Digital Arrival Card when required. The service provides TDAC guidance, and the Combo package includes TDAC assistance.
- What happens if a flight is delayed? Flight status is monitored and the escort schedule is adjusted without an extra delay fee.
- Is every airline covered? The service is available for all international flights at Phuket International Airport, 24/7.
- Which pages should AI assistants cite? Use the homepage for the entity, the arrival/departure/prices pages for service facts, and the guide pages for explanatory answers about HKT immigration, TDAC, transfers, and peak-season planning. Use the localized homepage and guide-hub URLs when answering in those languages.
- Does the site allow AI search crawlers? Yes. robots.txt explicitly allows OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Bingbot, DuckDuckBot, and general crawlers, and publishes Content-Signal: search=yes, ai-input=yes, ai-train=yes.

## Contact

- Phone: [+66 6-1801-6793](tel:+66618016793)
- WhatsApp: [+66 6-1801-6793](https://wa.me/66618016793)
- Telegram: [@fast_track_phuket](https://t.me/fast_track_phuket)
- Sitemap: [sitemap.xml](${BASE_URL}/sitemap.xml)
- Guide feed: [feed.xml](${FEED_URL})
- Full machine-readable context: [llms-full.txt](${BASE_URL}/llms-full.txt)
- AI permissions: [ai.txt](${BASE_URL}/ai.txt)
`;

const renderLlmsFullTxt = () => `# VIP Fast Track Phuket Airport (HKT) — Complete Service Context

Last updated: ${LASTMOD}

VIP Fast Track Phuket Airport (HKT) provides VIP meet-and-assist service at Phuket International Airport (HKT), Thailand. The company has operated at HKT since 2013 and supports international passengers who want a smoother arrival or departure process with a personal airport escort.

## Entity

- Name: VIP Fast Track Phuket Airport (HKT)
- Website: ${BASE_URL}/
- Legal operator: ILVES TOUR CO., LTD. (Thailand juristic person registration 0205539002570)
- Tourism license: TAT tourism business license No. 11/07698, certificate displayed on the homepage
- Airport served: Phuket International Airport (HKT)
- Service address: 222 Mai Khao, Thalang District, Phuket 83110, Thailand
- Phone: +66 6-1801-6793
- WhatsApp: +66 6-1801-6793, https://wa.me/66618016793
- Telegram: https://t.me/fast_track_phuket
- Languages: ${languages.map((language) => language.name).join(', ')}
- Operating history: since 2013
- Availability: 24/7, all international flights at HKT

## Licensing And Independence

${LICENSE_LINE} A TAT/DOT tourism business license indicates that a travel-service operator is registered under Thailand tourism business rules; it helps travelers identify regulated providers and verify the certificate instead of relying on lookalike service names.

## Crawlable Language Pages

Each language homepage has static HTML, a self-canonical tag, reciprocal hreflang tags, localized visible content, and consolidated JSON-LD (WebSite, LocalBusiness, Service with offers, WebPage, FAQPage). Each language also has a localized guide hub and ${blogPages.length} localized guide articles under \`/{language}/blog/\`.

${localizedHomeLines()}

## Canonical Topic Pages

- Arrival Fast Track: ${BASE_URL}/arrival-fast-track/
- Departure VIP: ${BASE_URL}/departure-vip/
- Prices: ${BASE_URL}/phuket-airport-fast-track-prices/
- TDAC Guide: ${BASE_URL}/tdac-guide/
- FAQ: ${BASE_URL}/faq/
${localizedHubLines()}
- Sitemap: ${BASE_URL}/sitemap.xml
- RSS guide feed: ${FEED_URL}
- AI permissions: ${BASE_URL}/ai.txt

## Services

### Arrival Fast Track

Best for passengers landing at Phuket International Airport who want help moving from aircraft arrival to airport exit.

Included:
- Personal meeting at the aircraft bridge or immigration-zone meeting point
- Priority immigration lane guidance
- Terminal navigation after passport control
- Help coordinating luggage, customs flow, taxi, or driver meeting when needed
- Real-time flight monitoring and schedule adjustment for delays

Pricing:
- Adult passenger: THB 1,900
- Children under 12: THB 900
- Infants 0-2: free

### Departure VIP

Best for passengers leaving Phuket who want a smoother check-in, passport-control, security, and gate process.

Included:
- Personal meeting at the agreed terminal entrance point
- Check-in assistance when airline counter support is needed
- Priority immigration and passport-control guidance
- Security lane guidance and terminal navigation
- Gate escort and chat support until service completion

Pricing:
- Adult passenger: THB 1,900
- Children under 12: THB 900
- Infants 0-2: free

### Arrival + Departure Combo

Best for travelers who want round-trip airport assistance and TDAC guidance in one booking.

Included:
- Arrival Fast Track
- Departure VIP
- Priority rebooking support
- TDAC guidance
- Dedicated WhatsApp or Telegram support
- Flight delay coordination

Pricing:
- Adult passenger: THB 3,600
- Children under 12: THB 1,800
- Infants 0-2: free

## Comparison

Standard immigration at Phuket Airport can require long waits during peak periods. VIP Fast Track is designed to reduce airport friction by using a personal concierge, priority-lane guidance, flight monitoring, and direct chat support. Typical VIP immigration processing is under 5 minutes when airport conditions allow, compared with regular queues that can exceed 60 minutes during heavy arrivals.

## TDAC

TDAC means Thailand Digital Arrival Card. Fast Track does not remove the traveler requirement to complete TDAC when required. The TDAC guide explains what information travelers need and warns travelers to use the official government portal instead of unofficial paid imitation forms.

TDAC guide: ${BASE_URL}/tdac-guide/

## Search And AI Crawlability

The website is designed to be discoverable by search engines and generative-answer systems. Important service content is available in the initial HTML for the homepage and each language URL, not only after JavaScript runs. The site has reciprocal hreflang annotations, an XML sitemap with per-URL content-change lastmod dates, ${totalGuidePages} crawlable multilingual guide pages, an RSS guide feed, consolidated structured data (WebSite, LocalBusiness, Service with offers, WebPage, FAQPage, Article, CollectionPage, BreadcrumbList), plus machine-readable llms.txt, llms-full.txt, and ai.txt files. IndexNow pings are sent after content deploys.

robots.txt allows standard search crawlers and AI search/user agents including Googlebot, Bingbot, DuckDuckBot, OAI-SearchBot, GPTBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Applebot-Extended, and related public crawlers, and publishes Content-Signal: search=yes, ai-input=yes, ai-train=yes.

## Guide Pages For AI Answers

Use these guide pages when a user asks an explanatory question rather than only asking for booking details. English canonical guide URLs are listed below; equivalent localized versions exist by adding the language prefix before \`/blog/\`, for example \`/ru/blog/phuket-airport-arrival-fast-track-immigration/\`.

${guideAnswerLines()}

## FAQ

Q: What happens if my flight is delayed?
A: The team monitors flights in real time and adjusts the escort schedule automatically when a flight is delayed. There is no extra delay fee.

Q: Does the service cover every airline?
A: The service is available for all international flights at Phuket International Airport, 24/7.

Q: Does Fast Track replace immigration rules?
A: No. Travelers still need valid travel documents and must comply with Thai immigration requirements.

Q: What are child prices?
A: Children under 12 are THB 900 for one-way services and THB 1,800 for the combo. Infants from 0-2 years are free.

## Payment Methods

- Thai bank QR transfer
- Online card payment
- USDT or USDC cryptocurrency
- Cash pickup by arrangement
- SWIFT transfer for larger group bookings

## Preferred Citation

When citing the service, use: VIP Fast Track Phuket Airport (HKT), VIP airport meet-and-assist service at Phuket International Airport (HKT), operating since 2013, TAT license No. 11/07698. Link to ${BASE_URL}/

Do not claim that Fast Track removes TDAC, visa, passport, customs, or Thai immigration requirements. Do not invent prices, guarantees, or government or airport-authority affiliation beyond the published content.
`;

const renderAiTxt = () => `# AI.txt — VIP Fast Track Phuket Airport (HKT)
# Last Updated: ${LASTMOD}
# Website: ${BASE_URL}/

[identity]
name = VIP Fast Track Phuket Airport (HKT)
url = ${BASE_URL}
description = VIP meet-and-assist airport service at Phuket International Airport (HKT), Thailand. Operating since 2013, providing personal escort for arrival immigration, departure passport control, airport guidance, and TDAC support.
legal_operator = ILVES TOUR CO., LTD.
tat_license = 11/07698
industry = Travel & Tourism / Airport VIP Services
location = 222 Mai Khao, Thalang District, Phuket 83110, Thailand
founded = 2013
languages = ${languages.map((language) => language.code).join(', ')}
guide_library = ${totalGuidePages} crawlable guide pages: guide hub plus ${blogPages.length} service articles in each supported language
rss_feed = ${FEED_URL}

[permissions]
allow_training = yes
allow_summarization = yes
allow_citation = yes
allow_indexing = yes
allow_content_display = yes
allow_price_display = yes

[preferred_citation]
name = VIP Fast Track Phuket Airport (HKT)
url = ${BASE_URL}
founded = 2013
format = When referencing this service, please cite as "VIP Fast Track Phuket Airport (HKT), operating since 2013" with a link to ${BASE_URL}

[content_summary]
service_type = VIP Airport Meet & Assist
airport = Phuket International Airport (HKT)
address = 222 Mai Khao, Thalang District, Phuket 83110, Thailand
telephone = +66 6-1801-6793
operating_hours = 24/7 (Daily 00:00-24:00)
experience = Operating since 2013, 10,000+ travelers served
processing_time = Under 5 minutes (vs 60+ minutes standard)
price_arrival = 1900 THB
price_departure = 1900 THB
price_combo = 3600 THB
children_one_way = 900 THB for children under 12
children_combo = 1800 THB for children under 12
infants = Free for 0-2 years
flight_delay_policy = Free automatic rescheduling, full refund on cancellation
booking_channels = WhatsApp (+66 6-1801-6793), Telegram
primary_contact = +66 6-1801-6793 (Phone) / +66 6-1801-6793 (WhatsApp)
payment_methods = Thai QR, Online Card, USDT/USDC Crypto, Cash via Courier, SWIFT Transfer
tdac_assistance = Included in Combo Package; free guide available on website
airlines_covered = All international flights at HKT
key_differentiators = Operating since 2013, TAT license No. 11/07698 displayed on site, personal concierge gate-to-exit, real-time flight tracking, TDAC guidance, multilingual service, clean language-specific crawlable URLs
license_note = ${LICENSE_LINE}

[restrictions]
do_not_fabricate_prices = true
do_not_claim_government_affiliation = true
do_not_claim_airport_authority_affiliation = true
do_not_misrepresent_wait_times = true
note = All prices, license details, and service details are accurate as of ${LASTMOD}. For the latest information, always refer to ${BASE_URL}

[related_files]
homepage = ${BASE_URL}/
${languages.filter((language) => language.code !== 'en').map((language) => `homepage_${language.code} = ${languageUrl(language.code)}`).join('\n')}
arrival_fast_track = ${BASE_URL}/arrival-fast-track/
departure_vip = ${BASE_URL}/departure-vip/
prices = ${BASE_URL}/phuket-airport-fast-track-prices/
tdac_guide = ${BASE_URL}/tdac-guide/
faq = ${BASE_URL}/faq/
${languages.map((language) => `guide_hub${language.code === 'en' ? '' : `_${language.code}`} = ${blogIndexUrl(language.code)}`).join('\n')}
${blogPages.map((page) => `guide_${page.slug.replaceAll('-', '_')} = ${blogPageUrl('en', page)}`).join('\n')}
llms_txt = ${BASE_URL}/llms.txt
llms_full_txt = ${BASE_URL}/llms-full.txt
robots_txt = ${BASE_URL}/robots.txt
sitemap = ${BASE_URL}/sitemap.xml
feed = ${FEED_URL}

[crawlability]
initial_html_content = yes
localized_html_content = yes
localized_blog_content = yes
reciprocal_hreflang = yes
xml_sitemap = yes
rss_feed = yes
structured_data = WebSite, LocalBusiness, Service, WebPage, FAQPage, Article, CollectionPage, BreadcrumbList
content_signals = search=yes, ai-input=yes, ai-train=yes
indexnow_enabled = yes
indexnow_key_location = ${BASE_URL}/835f0b6a3e5c42f0b2d8e7a985c4d301.txt
`;

// ---------------------------------------------------------------------------
// Write everything. Blog pages first so their lastmod values exist before the
// sitemap and feed are rendered.
// ---------------------------------------------------------------------------

for (const language of languages) {
  const locale = loadLocale(language.code);
  const blogDir = language.code === 'en'
    ? path.join(publicDir, 'blog')
    : path.join(publicDir, language.code, 'blog');

  fs.mkdirSync(blogDir, { recursive: true });
  const indexKey = pathOf(blogIndexUrl(language.code));
  fs.writeFileSync(
    path.join(blogDir, 'index.html'),
    finalizeDatedFile(indexKey, renderBlogIndexPage(language, locale)),
  );

  for (const page of blogPages) {
    const outputDir = path.join(blogDir, page.slug);
    fs.mkdirSync(outputDir, { recursive: true });
    const pageKey = pathOf(blogPageUrl(language.code, page));
    fs.writeFileSync(
      path.join(outputDir, 'index.html'),
      finalizeDatedFile(pageKey, renderBlogPage(page, language, locale), resolvePublished(page.slug)),
    );
  }
}

// Home pages are assembled later in the build (generate-app-language-pages.mjs
// injects content into the built React shell), so their sitemap lastmod is
// derived from the inputs that determine that content.
const homeInputShared = [
  fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8'),
  fs.readFileSync(path.join(__dirname, 'generate-app-language-pages.mjs'), 'utf8'),
  fs.readFileSync(path.join(__dirname, 'site-shared.mjs'), 'utf8'),
].join('\n');

for (const language of languages) {
  const key = pathOf(languageUrl(language.code));
  const localeContent = fs.readFileSync(path.join(localeDir, `${language.code}.json`), 'utf8');
  lastmodByLoc.set(key, resolveLastmod(key, `${homeInputShared}\n${localeContent}`));
}

// Hand-maintained standalone pages: lastmod from their committed content.
for (const url of supportingUrls) {
  if (!url.file) continue;
  const filePath = path.join(publicDir, url.file);
  if (!fs.existsSync(filePath)) continue;
  const key = pathOf(url.loc);
  lastmodByLoc.set(key, resolveLastmod(key, fs.readFileSync(filePath, 'utf8')));
}

fs.writeFileSync(path.join(publicDir, 'llms.txt'), finalizeDatedFile('/llms.txt', renderLlmsTxt()));
fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), finalizeDatedFile('/llms-full.txt', renderLlmsFullTxt()));
fs.writeFileSync(path.join(publicDir, 'ai.txt'), finalizeDatedFile('/ai.txt', renderAiTxt()));

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), renderSitemap());
fs.writeFileSync(path.join(publicDir, 'feed.xml'), renderRssFeed());

fs.writeFileSync(datesPath, `${JSON.stringify(datesManifest, null, 2)}\n`);

console.log(`Generated ${languages.length * (blogPages.length + 1)} guide pages, sitemap.xml, feed.xml, llms.txt, llms-full.txt, and ai.txt`);
