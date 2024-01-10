import { createContext }          from 'react'
import type { UmamiContextValue } from './types'

export const UmamiContext = createContext<UmamiContextValue>({
  canTrack: () => false,
  hostUrl:  '',
  track:    () => {
    // eslint-disable-next-line no-console
    console.log('NO TRACK - DEFAULT')
  },
  getEventPayloadFields: () => null,
  websiteId:             '',
})
