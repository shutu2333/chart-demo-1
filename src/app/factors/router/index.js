/* @flow */

import {
  routerReducer as Router,
  push as Push,
  routerMiddleware,
} from 'react-router-redux'

import { type Location as RouterLocation } from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'


// We also setup history here so that it can be imported
// in router component and store.
export const history = createHistory()
export const routerMiddlewareWithHistory = routerMiddleware(history)

export type Location = RouterLocation

export type State = {
  location: ?Location,
}

export const defaultState: State = {
  location: null,
}

export { Push }

export default Router
