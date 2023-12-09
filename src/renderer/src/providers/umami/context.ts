import { createContext } from 'react'
import { UmamiContextValue } from './types'

export const UmamiContext = createContext<UmamiContextValue>({
  canTrack: () => false,
  hostUrl: '',
  track: () => {
    console.log('NO TRACK - DEFAULT')
  },
  getEventPayloadFields: () => null,
  websiteId: ''
})
