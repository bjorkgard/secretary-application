import type { UmamiTrackEvent } from './types'

export function doNotTrack(): boolean {
  // @ts-expect-error Because
  const { doNotTrack, navigator, external } = window

  const msTrackProtection = 'msTrackingProtectionEnabled'
  const msTracking        = (): boolean => {
    return (
      // @ts-expect-error Because
      external && msTrackProtection in external && external[msTrackProtection]()
    )
  }

  const dnt
    = doNotTrack
    || navigator.doNotTrack
    // @ts-expect-error Because
    || navigator.msDoNotTrack
    || msTracking()

  return dnt === '1' || dnt === 'yes'
}

export function removeTrailingSlash(url: string): string {
  return url && url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url
}

export function post(
  url: string,
  data: UmamiTrackEvent,
  headers?: Record<string, string>,
): Promise<{ status: number, statusText: string, body?: string }> {
  if ('fetch' in window) {
    return fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body:    JSON.stringify(data),
      cache:   'no-cache',
    }).then(async (res) => {
      if (res.ok) {
        return {
          status:     res.status,
          statusText: res.statusText,
          body:       await res.text(),
        }
      }
      // eslint-disable-next-line no-throw-literal
      throw {
        status:     res.status,
        statusText: res.statusText,
      }
    })
  }
  else if ('XMLHttpRequest' in window) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.open('POST', url, true)
      req.setRequestHeader('Content-Type', 'application/json')

      for (const header in headers) {
        if (headers[header])
          req.setRequestHeader(header, headers[header])
      }

      req.onload  = function (): void {
        if (req.status >= 200 && req.status < 300) {
          resolve({
            status:     req.status,
            statusText: req.statusText,
            body:       req.response as string,
          })
        }
        else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            status:     req.status,
            statusText: req.statusText,
          })
        }
      }
      req.onerror = function (): void {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          status:     req.status,
          statusText: req.statusText,
        })
      }

      req.ontimeout = (): void => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          status:     408,
          statusText: 'Timeout',
        })
      }

      req.send(JSON.stringify(data))
    })
  }
  else {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ status: -1, statusText: 'Unsopported env' })
  }
}
