import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations for different languages
import enTranslation from './Language/en.json';
import viTranslation from './Language/vi.json';
import ruTranslation from './Language/ru.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Initialize i18next with react-i18next
  .init({
    lng: 'ru-RU', // Default language
    fallbackLng: 'en-EN', // Fallback language if translation not found
    debug: true, // Enable debug mode (optional)
    interpolation: {
      escapeValue: false, // React already escapes values by default
    },
    resources: {
      "en-EN": {
        translation: enTranslation, // English translations
      },
      "vi-VN": {
        translation: viTranslation, // Vietnamese translations
      },
      "ru-RU": {
        translation: ruTranslation, // Russian translations
      },
    },
  });

export default i18n;