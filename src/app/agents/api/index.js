/* @flow */
import fetch from 'isomorphic-fetch'

import type { User } from 'tandem'
import { regions } from 'tandem'

import {
  IncLoading,
  DecLoading,
  type State as StateNetwork,
} from '../../factors/network'


// START AUTH STATE
//
// Please do not import factors/auth, it will create a
// circular dependency, because we need api in auth to make
// calls.

export type StateAuth = {
  token: ?string,
  user: ?User,
}


let endpoints: { [string]: string } = {}

declare var ALT_API_DOMAINS : string
// This is mostly to clarify that we use this for local builds.
// we never pubish non-production builds online, even for development.
if (process.env.NODE_ENV !== 'production' && ALT_API_DOMAINS) {
  endpoints = ALT_API_DOMAINS.split(',').reduce((ep, e) => {
    const es = e.split('::')
    ep[es[0]] = es[1]

    return ep
  }, {})

  // eslint-disable-next-line no-console
  console.log(`[DEV]     alt api domains : ${ ALT_API_DOMAINS }`)
  // eslint-disable-next-line no-console
  console.log(`[WARNING] using alternative domains: ${ JSON.stringify(endpoints) }`)
}

if (!endpoints.global) {
  const apiBase = `api.${ window.location.hostname }`
  endpoints = ['global']
    .concat(Object.keys(regions))
    .reduce((ep, name) => {
      // don't even think about http.
      ep[name] = `https://${ name }.${ apiBase }`
      return ep
    }, {})
}


type MethodType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE';

type requestOptions = {
  method: MethodType,
  path: string,
  body?: Object,
  headers?: Headers,
  contentType?: string,
  queryParams?: Array<{
    key: string,
    value: string,
  }>,
  region: string
}

export const noop = {}

export function request<T>(
  dispatch: *,
  getState: () => { network: StateNetwork, auth: StateAuth },
  req: requestOptions,
): Promise<T> {
  dispatch(IncLoading())

  const headers = req.headers ? req.headers : new Headers()

  const { token } = getState().auth
  if (token) {
    headers.append('authorization', `Bearer ${ token }`)
  }

  if (req.contentType) {
    headers.append('Content-Type', req.contentType)
  } else {
    headers.append('Content-Type', 'application/json; charset=utf-8')
  }

  const r : RequestOptions = {
    headers,
    method: req.method,
  }

  if (req.body) {
    r.body = JSON.stringify(req.body)
  }

  const endpoint = endpoints[req.region]

  let url = `${ endpoint }/${ req.path }`

  if (req.queryParams) {
    const esc = encodeURIComponent
    const query = req.queryParams
      .map(params => {
        return `${ esc(params.key) }=${ esc(params.value) }`
      })
      .join('&')
    url = `${ url }?${ query }`
  }

  return fetch(url, r).then(
    (resp: Response) => {
      dispatch(DecLoading())

      const contentType = resp.headers.get('Content-Type')
      const traceId = resp.headers.get('X-Trace-Id')

      if (resp.status === 200 || resp.status === 201) {
        if (contentType && contentType.includes('application/json')) {
          return (resp.json(): Promise<T>)
        }
        return resp.text().then((e) => {
          return ({ message: e }: any)
        })
      }

      return resp.json().then(
        // eslint-disable-next-line prefer-promise-reject-errors
        reason => Promise.reject({
          traceId,
          reason,
          status: resp.status,
        }),
      )
    },

    reason => {
      dispatch(DecLoading())

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        message: 'Could not connect. Please check your connection and try again.',
        code: -1,
        reason,
      })
    },

  )
}
