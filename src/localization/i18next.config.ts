import path           from 'node:path'
import i18n           from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import whitelist      from './whitelist'

const isDev
  // eslint-disable-next-line node/prefer-global/process
  = import.meta.env.MAIN_VITE_NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'

const i18nextOptions = {
  debug:   false,
  backend: {
    loadPath: isDev
      ? './src/localization/locales/{{lng}}/{{ns}}.json'
      // eslint-disable-next-line node/prefer-global/process
      : path.join(process.resourcesPath, 'locales', '{{lng}}/{{ns}}.json'),
    addPath: isDev
      ? './src/localization/locales/{{lng}}/{{ns}}.missing.json'
      // eslint-disable-next-line node/prefer-global/process
      : path.join(process.resourcesPath, 'locales', '{{lng}}/{{ns}}.missing.json'),
    jsonIndent: 2,
  },
  interpolation: {
    escapeValue: false,
  },
  saveMissing: true,
  fallbackLng: 'sv',
  lng:         'sv',
  whitelist:   whitelist.languages,
}

i18n.use(i18nextBackend)

// initialize if not already initialized
if (!i18n.isInitialized)
  i18n.init(i18nextOptions)

export default i18n
