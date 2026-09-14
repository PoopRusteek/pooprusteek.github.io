import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import ru from './locales/ru'

// To add a language: create locales/<code>.ts typed as `typeof en`, register
// it here and in LANGS. The router picks it up as a `/<code>/` URL prefix.
export const LANGS = ['en', 'ru'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_LABEL: Record<Lang, string> = { en: 'EN', ru: 'RU' }

/** BCP 47 tag for <html lang>, hreflang and og:locale. */
export const LANG_LOCALE: Record<Lang, string> = { en: 'en_US', ru: 'ru_RU' }

// The language comes from the URL (lib/route-store.ts), never from the
// browser or storage: a prerendered page and the page that hydrates it must
// agree, and search engines only ever see the URL. `initAsync: false` makes
// init synchronous with inline resources, which the prerenderer relies on.
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: [...LANGS],
  initAsync: false,
  interpolation: { escapeValue: false }, // React escapes on its own
})

if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng
  })
}

export default i18n
