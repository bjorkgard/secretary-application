import { useCallback, useMemo }                                             from 'react'
import { cacheKey, localStorageMainTurnoffKey, umamiApiEventIngestionPath } from './const'
import { UmamiContext }                                                     from './context'
import { doNotTrack, post, removeTrailingSlash }                            from './utils'
import type { UmamiTrackEvent, UmamiTrackEventPayload }                     from './types'

interface UmamiProviderProps {
  websiteId:          string
  getCurrentUrl:      () => string
  // url: string;
  domains?:           string[]
  respectDoNotTrack?: boolean
  hostUrl:            string
  useCache?:          boolean
  // autoTrack: boolean; // default true (Tracks Pageviews and Events (using auto binding function)) (Needs history for pageviews and dom binding/jsx helper binders on events (ex <div onClick={umamiTrack('click')})) /> where umamiTrack: (eventType: string) => (event) => void)
}

/*

https://umami.is/docs/api

*/

export default function UmamiProvider({
  websiteId,
  children,
  useCache = false,
  domains = [],
  getCurrentUrl,
  respectDoNotTrack = true,
  ...props
}: React.PropsWithChildren<UmamiProviderProps>): JSX.Element {
  const windowInfo = useMemo(() => {
    if (typeof window == 'undefined') {
      return {
        screen:   `SSR`,
        language: '',
        hostname: 'localhost',
        pathname: '',
        search:   '',
        title:    '',
      }
    }
    const {
      screen: { width, height },
      navigator: { language },
      location: { hostname, pathname, search },
    } = window
    return {
      screen: `${width}x${height}`,
      language,
      hostname,
      pathname,
      search,
      title:  document.title,
    }
  }, [])

  const mainCanTrack = useCallback(
    () =>
      (respectDoNotTrack ? !doNotTrack() : true)
      && (domains.length === 0 || (domains.length > 0 && domains.includes(windowInfo.hostname)))
      && (!localStorage || (localStorage && !localStorage.getItem(localStorageMainTurnoffKey))),
    [respectDoNotTrack, windowInfo.hostname, domains],
  )

  const getEventPayloadFields = (): UmamiTrackEventPayload => {
    const { hostname, language, screen, title } = windowInfo
    return {
      website:  websiteId,
      hostname: hostname || 'localhost',
      language,
      screen,
      url:      getCurrentUrl(),
      title,
    }
  }

  const hostUrl = useMemo(() => {
    return removeTrailingSlash(props.hostUrl)
  }, [props.hostUrl])

  const track = useCallback(
    async (data: UmamiTrackEvent, forceTrack: boolean = false) => {
      if (!mainCanTrack() && !forceTrack)
        return 'NO_TRACK'

      let headers: Record<string, string> = {}
      if (useCache && sessionStorage.getItem(cacheKey))
        headers = { 'x-umami-cache': sessionStorage.getItem(cacheKey)! }

      return post(`${hostUrl}${umamiApiEventIngestionPath}`, data, headers).then((response) => {
        if (useCache && sessionStorage && response.body)
          sessionStorage.setItem(cacheKey, response.body)
        return response.body
      })
    },
    [hostUrl, mainCanTrack, useCache],
  )

  return (
    <UmamiContext.Provider
      value={{
        websiteId,
        getEventPayloadFields,
        hostUrl,
        canTrack: mainCanTrack,
        track,
      }}
    >
      {children}
    </UmamiContext.Provider>
  )
}
