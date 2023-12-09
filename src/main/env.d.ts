/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_API: string
  readonly MAIN_VITE_TOKEN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
