import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'

import i18n from '../../localization/i18next.config.client'
import './assets/index.css'
import App from './core/App'

window.electron.ipcRenderer.invoke('get-initial-translations').then((args) => {
  i18n.addResources(args.language, args.namespace, args.resources)
  i18n.changeLanguage(args.language)
})

window.electron.ipcRenderer.on('change-translation', (_, args) => {
  if (!i18n.hasResourceBundle(args.language, args.namespace)) {
    i18n.addResources(args.language, args.namespace, args.resources)
  }

  i18n.changeLanguage(args.language)
})

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </StrictMode>
)
