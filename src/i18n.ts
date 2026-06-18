import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import he from './locales/he.json';
import ar from './locales/ar.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';

const supportedLanguages = ['en', 'ru', 'zh', 'hi', 'he', 'ar', 'es', 'fr', 'de', 'it'];
const selectedLanguageStorageKey = 'fasttrack.selectedLanguage';

const normalizeLanguage = (language: string) => {
  const normalized = language.toLowerCase();
  if (normalized === 'iw') return 'he';
  return normalized.split('-')[0];
};

const detectBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en';

  const browserLanguages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  const detectedLanguage = browserLanguages
    .map((language) => normalizeLanguage(language))
    .find((language) => supportedLanguages.includes(language));

  return detectedLanguage || 'en';
};

const detectInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';

  const pathLanguage = normalizeLanguage(window.location.pathname.split('/').filter(Boolean)[0] || '');
  if (supportedLanguages.includes(pathLanguage)) return pathLanguage;

  const queryLanguageValue = new URLSearchParams(window.location.search).get('lang');
  const queryLanguage = queryLanguageValue ? normalizeLanguage(queryLanguageValue) : '';
  if (queryLanguage && supportedLanguages.includes(queryLanguage)) return queryLanguage;

  try {
    const storedLanguageValue = window.localStorage.getItem(selectedLanguageStorageKey);
    const storedLanguage = storedLanguageValue ? normalizeLanguage(storedLanguageValue) : '';
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) return storedLanguage;
  } catch {
    // Ignore blocked storage and fall back to browser language detection.
  }

  return detectBrowserLanguage();
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      zh: { translation: zh },
      hi: { translation: hi },
      he: { translation: he },
      ar: { translation: ar },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
    },
    lng: detectInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
