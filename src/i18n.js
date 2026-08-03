import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr'];
const STORAGE_KEY = 'tapir-lang';

// The URL path is authoritative when present (e.g. /fr) so a shared link always opens in the
// right language for whoever clicks it, regardless of their own browser/localStorage. Only when
// there is no language segment in the path do we fall back to a previously remembered choice,
// then to the browser's language, then to English.
function detectInitialLanguage() {
  const pathLang = window.location.pathname.split('/').filter(Boolean)[0];
  if (SUPPORTED_LANGUAGES.includes(pathLang)) {
    return pathLang;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }
  const browserLang = (navigator.language || '').slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Switches the active language, persists the choice, and updates the URL to /<lang> (or / for
// English) via pushState - no page reload, but the resulting URL is shareable and will open
// directly in that language for anyone else who opens it.
export function changeLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }
  i18n.changeLanguage(lang);
  window.localStorage.setItem(STORAGE_KEY, lang);
  const newPath = lang === 'en' ? '/' : `/${lang}`;
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath);
  }
}

export default i18n;
