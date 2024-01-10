import type { post } from './utils'

export interface UmamiContextValue {
  websiteId:             string
  getEventPayloadFields: () => UmamiTrackEventPayload | null
  hostUrl:               string
  canTrack:              () => boolean
  track:
    | ((
      data: UmamiTrackEvent,
      forceTrack?: boolean
    ) => Promise<Awaited<ReturnType<typeof post>>['body'] | 'NO_TRACK'>)
    | (() => void)
}

export interface UmamiTrackEventPayload {
  hostname:  string
  language:  string
  referrer?: string
  screen:    string
  title:     string
  url:       string
  website:   string
  name?:     string
  data?:     UmamiCustomEventData
}

export interface UmamiTrackEvent {
  payload: UmamiTrackEventPayload
  type:    'event'
}

export type UmamiCustomEventData = Record<string, string | number | boolean>
