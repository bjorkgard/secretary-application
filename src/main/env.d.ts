/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_API:      string
  readonly MAIN_VITE_TOKEN:    string
  readonly MAIN_VITE_NODE_ENV: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
