import { useUmamiPageTrack } from './hooks'

function PageTracker({ pageUrl }: { pageUrl: string }): null {
  useUmamiPageTrack({ pageUrl })
  return null
}

export { PageTracker }
