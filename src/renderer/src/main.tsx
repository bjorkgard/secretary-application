import React, { StrictMode, Suspense } from 'react'
import { createRoot }                  from 'react-dom/client'
import { I18nextProvider }             from 'react-i18next'
import Bugsnag                         from '@bugsnag/electron'
import BugsnagPluginReact              from '@bugsnag/plugin-react'

import i18n from '../../localization/i18next.config.client'
import './assets/index.css'
import App  from './core/App'

Bugsnag.start({
  plugins: [new BugsnagPluginReact()],
})

const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React)

window.electron.ipcRenderer.invoke('get-initial-translations').then((args) => {
  i18n.addResources(args.language, args.namespace, args.resources)
  i18n.changeLanguage(args.language)
})

window.electron.ipcRenderer.on('change-translation', (_, args) => {
  if (!i18n.hasResourceBundle(args.language, args.namespace))
    i18n.addResources(args.language, args.namespace, args.resources)

  i18n.changeLanguage(args.language)
})

function ErrorScreen({ clearError }) {
  return (
    <div>
      <h1>⚠️ Error ⚠️</h1>
      <p><strong>Uh oh, there was an error in the application!</strong></p>
      <button onClick={clearError}>Reset</button>
    </div>
  )
}

function onError(event: any) {
  // You can also provide an onError callback to run just on errors caught by
  // the error boundary. Maybe you want to attach some of the current state from
  // whatever model/store you're using (e.g redux)
  console.error('about to send this event', { event })
}

const container = document.getElementById('root') as HTMLElement
const root      = createRoot(container)

const children = (
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </StrictMode>
)

root.render(
  ErrorBoundary
    ? (
      <ErrorBoundary FallbackComponent={ErrorScreen} onError={onError}>{children}</ErrorBoundary>
      )
    : (
        children
      ),
)
