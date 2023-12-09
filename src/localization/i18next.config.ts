import i18n from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import whitelist from './whitelist'

const i18nextOptions = {
  debug: false,
  backend: {
    loadPath: './src/localization/locales/{{lng}}/{{ns}}.json',
    addPath: './src/localization/locales/{{lng}}/{{ns}}.missing.json',
    jsonIndent: 2
  },
  interpolation: {
    escapeValue: false
  },
  saveMissing: true,
  fallbackLng: 'sv',
  whitelist: whitelist.languages
}

i18n.use(i18nextBackend)

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(i18nextOptions)
}

export default i18n
