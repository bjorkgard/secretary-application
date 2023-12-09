import { useUmamiPageTrack } from './hooks'

const PageTracker = ({ pageUrl }: { pageUrl: string }): null => {
  useUmamiPageTrack({ pageUrl })
  return null
}

export { PageTracker }
