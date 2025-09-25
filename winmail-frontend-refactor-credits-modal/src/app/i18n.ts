'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deTranslation from '../locales/de/translation.json';
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';
import frTranslation from '../locales/fr/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import idTranslation from '../locales/id/translation.json';
import jaTranslation from '../locales/ja/translation.json';
import ptTranslation from '../locales/pt/translation.json';
import ruTranslation from '../locales/ru/translation.json';
import zhTranslation from '../locales/zh/translation.json';

const resources = {
  de: {
    translation: deTranslation,
  },
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  id: {
    translation: idTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
