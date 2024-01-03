import i18n from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import whitelist from './whitelist'
import isDev from 'electron-is-dev'
import path from 'path'

const i18nextOptions = {
  debug: false,
  backend: {
    loadPath: isDev
      ? './src/localization/locales/{{lng}}/{{ns}}.json'
      : path.join(process.resourcesPath, 'locales', '{{lng}}/{{ns}}.json'),
    addPath: isDev
      ? './src/localization/locales/{{lng}}/{{ns}}.missing.json'
      : path.join(process.resourcesPath, 'locales', '{{lng}}/{{ns}}.missing.json'),
    jsonIndent: 2
  },
  interpolation: {
    escapeValue: false
  },
  saveMissing: true,
  fallbackLng: 'sv',
  lng: 'sv',
  whitelist: whitelist.languages
}

i18n.use(i18nextBackend)

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(i18nextOptions)
}

export default i18n
