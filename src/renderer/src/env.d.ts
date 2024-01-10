/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_NODE_ENV:        string
  readonly MAIN_VITE_API:             string
  readonly MAIN_VITE_TOKEN:           string
  readonly MAIN_VITE_APP_VERSION:     string
  readonly RENDERER_VITE_NODE_ENV:    string
  readonly RENDERER_VITE_APP_VERSION: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
