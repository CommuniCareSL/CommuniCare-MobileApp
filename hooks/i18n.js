import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../translations/en.json';
import si from '../translations/si.json';
import ta from '../translations/ta.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta }
  },
  lng: 'en', // default language
  fallbackLng: 'en', // fallback language
  interpolation: {
    escapeValue: false // not needed for React
  }
});

export default i18n;
