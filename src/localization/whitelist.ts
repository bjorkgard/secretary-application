import type { BrowserWindow, MenuItem, MenuItemConstructorOptions } from 'electron'

interface WhitelistMap {
  [key: string]: string
}

const whitelistMap: WhitelistMap = {
  en: 'English', // English
  sv: 'Svenska', // Swedish
}

// const whitelistMap: WhitelistMap = {
//  af: 'Afrikaans', // Afrikaans
//  ar: 'عربى', // Arabic
//  am: 'አማርኛ', // Amharic
//  bg: 'български', // Bulgarian
//  ca: 'Català', // Catalan
//  cs: 'čeština', // Czech
//  da: 'Dansk', // Danish
//  de: 'Deutsche', // German
//  el: 'Ελληνικά', // Greek
//  en: 'English', // English
//  es: 'Español', // Spanish
//  et: 'Eestlane', // Estonian
//  fa: 'فارسی', // Persian
//  fi: 'Suomalainen', // Finnish
//  fil: 'Pilipino', // Filipino
//  fr: 'Français', // French
//  gu: 'ગુજરાતી', // Gujarati
//  he: 'עברית', // Hebrew
//  hi: 'हिंदी', // Hindi
//  hr: 'Hrvatski', // Croatian
//  hu: 'Magyar', // Hungarian
//  id: 'Indonesia', // Indonesian
//  it: 'Italiano', // Italian
//  ja: '日本語', // Japanese
//  kn: 'ಕನ್ನಡ', // Kannada
//  ko: '한국어', // Korean
//  lt: 'Lietuvis', // Lithuanian
//  lv: 'Latvietis', // Latvian
//  ml: 'മലയാളം', // Malayalam
//  mr: 'मराठी', // Marathi
//  ms: 'Melayu', // Malay
//  nl: 'Nederlands', // Dutch
//  no: 'norsk', // Norwegian
//  pl: 'Polskie', // Polish
//  pt: 'Português', // Portuguese
//  ro: 'Română', // Romanian
//  ru: 'Pусский', // Russian
//  sk: 'Slovenský', // Slovak
//  sr: 'Српски', // Serbian
//  sv: 'Svenska', // Swedish
//  sw: 'Kiswahili', // Swahili
//  ta: 'தமிழ்', // Tamil
//  te: 'తెలుగు', // Telugu
//  th: 'ไทย', // Thai
//  tr: 'Türk', // Turkish
//  uk: 'Українська', // Ukranian
//  vi: 'Tiếng Việt', // Vietnamese
//  zh_CN: '简体中文', // Chinese
// };

const Whitelist = ((): { languages: string[], buildSubmenu: any } => {
  const clickFunction = (channel: string, lng: string, i18nextMainBackend: any): any => {
    return (_menuItem: MenuItem, browserWindow: BrowserWindow) => {
      // Solely within the top menu
      i18nextMainBackend.changeLanguage(lng)

      // Between renderer > main process
      browserWindow.webContents.send(channel, {
        lng,
      })
    }
  }

  const buildSubmenu = (channel: string, i18nextMainBackend: any): MenuItemConstructorOptions[] => {
    const langs   = Object.keys(whitelistMap)
    const submenu = langs.map(key => ({
      label: whitelistMap[key],
      click: clickFunction(channel, key, i18nextMainBackend),
    }))

    return submenu
  }

  return {
    languages: Object.keys(whitelistMap),
    buildSubmenu,
  }
})()

export default Whitelist
