/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_API:         string
  readonly MAIN_VITE_TOKEN:       string
  readonly MAIN_VITE_NODE_ENV:    string
  readonly MAIN_VITE_BUGSNAG:     string
  readonly MAIN_VITE_APP_VERSION: string
  readonly MAIN_VITE_PAT:         string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
