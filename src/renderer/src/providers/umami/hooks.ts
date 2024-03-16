import { useCallback, useContext, useEffect }         from 'react'
import { UmamiContext }                               from './context'
import type { UmamiCustomEventData, UmamiTrackEvent } from './types'

export function useUmamiEventTrack(): (
  eventName?: string,
  pageUrl?: string,
  eventValue?: UmamiCustomEventData,
  forceTrack?: boolean
) => void {
  const umamiCtx   = useContext(UmamiContext)
  const trackEvent = (
    eventName: string = 'custom',
    pageUrl: string = '/',
    eventValue?: UmamiCustomEventData,
    forceTrack: boolean = false,
  ): void => {
    try {
      /*
        EVENT

        {
        payload: {
          event_name: "click",
          event_value: "signup-button",
          website: "your-website-id",
          url: "/",
          hostname: "your-hostname",
          language: "en-US",
          screen: "1920x1080"
        },
        type: "event"
      }

      */

      const commonFields = umamiCtx.getEventPayloadFields()
      if (commonFields === null)
        throw new Error('Not initialized')

      /*
        EVENT

        {
        payload: {
          event_name: "click",
          event_value: "signup-button",
          website: "your-website-id",
          url: "/",
          hostname: "your-hostname",
          language: "en-US",
          screen: "1920x1080"
        },
        type: "event"
      }

      */
      const event: UmamiTrackEvent = {
        payload: {
          ...commonFields,
          name: eventName,
          url:  pageUrl,
          data: eventValue,
        },
        type: 'event',
      }
      // eslint-disable-next-line no-console
      console.log(event)
      umamiCtx.track(event, forceTrack)
    }
    catch (err) {
      console.warn && console.warn(err)
    }
  }

  return trackEvent
}

interface UseUmamiPageViewArg1 {
  referrer?: string
  pageUrl:   string
}

export function useUmamiPageTrack(
  {
    referrer = typeof document != 'undefined' ? document.referrer : undefined,
    pageUrl,
  }: UseUmamiPageViewArg1,
  skipPageView = false,
): (_pageUrl: string) => void | Promise<string | undefined> {
  const umamiCtx = useContext(UmamiContext)

  const track = useCallback((_pageUrl: string) => {
    /*
      PAGEVIEW

      {
        payload: {
          referrer: "",
          website: "your-website-id",
          url: "/",
          hostname: "your-hostname",
          language: "en-US",
          screen: "1920x1080",
        },
        type: "event"
      }
     */

    const commonFields = umamiCtx.getEventPayloadFields()
    if (commonFields === null)
      throw new Error('Not initialized')

    const pageViewEvt: UmamiTrackEvent = {
      payload: {
        ...commonFields,
        url: _pageUrl || pageUrl,
        referrer,
      },
      type: 'event',
    }
    return umamiCtx.track(pageViewEvt)
  }, [])

  useEffect(() => {
    if (!skipPageView)
      track(pageUrl)
  }, [pageUrl])

  return track
}
