import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { 
    translation: require('./locales/en.json')
  },
  ar: { 
    translation: require('./locales/ar.json')
  }
};

// Get device locale if available
let deviceLocale = 'en';
try {
  // This will be available when expo-localization is installed
  const Localization = require('expo-localization');
  deviceLocale = Localization.locale?.startsWith('ar') ? 'ar' : 'en';
} catch (e) {
  // Use default if expo-localization not available
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale,
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
