import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Whitelist from './whitelist'

const i18nextOptions = {
  debug: false,
  interpolation: {
    escapeValue: false
  },
  saveMissing: false,
  fallbackLng: 'sv',
  whitelist: Whitelist.languages,
  partialBundledLanguages: false,
  ns: ['translation'],
  defaultNs: 'translation',
  resources: {},
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: true
  }
}

i18n.use(initReactI18next)

if (!i18n.isInitialized) {
  i18n.init(i18nextOptions)
}

export default i18n
