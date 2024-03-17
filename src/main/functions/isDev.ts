export default function isDev(): boolean {
  // eslint-disable-next-line node/prefer-global/process
  return import.meta.env.MAIN_VITE_NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
}
