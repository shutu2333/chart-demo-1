/* @flow */

import {
  compose,
  createStore,
  applyMiddleware,
  type Store as ReduxStore,
} from 'redux'

import thunk from 'redux-thunk'

// import {
//   persistStore,
//   autoRehydrate,
// } from 'redux-persist'


import freezer from './freezer'

import factors, {
  defaultState,
  type State,
  type Action,
  type Thunk,
} from '../factors'


import { routerMiddlewareWithHistory } from '../factors/router'

import { SetReady } from '../factors/store'

import {
  Login,
  UpdateToken,
  PersistAuthToken,
  LoadAuthToken,
} from '../factors/auth'


let enhancer = compose(
  applyMiddleware(thunk, routerMiddlewareWithHistory),
  PersistAuthToken,
)

declare var process: { env: { NODE_ENV: string } }

if (process.env.NODE_ENV !== 'production') {
  const enhancers = [enhancer, freezer]

  if (
    typeof window !== 'undefined' &&
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__
  ) {
    // eslint-disable-next-line no-underscore-dangle
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }


  enhancer = compose(...enhancers)
}


// Dispatch is the intersection of the following function types
// 1 and 2.
export type Dispatch =
  // 1. Given a type R, a function D, dispatch:
  // Accepts a function that:
  //  - a. takes D and S
  //  - b. returns R
  //  - c. is a Thunk (part of Thunk union).
  // Returns: R
  // 2. give type A that is an Action, dispatch:
  // Accepts an object that:
  //  - a. is an A (part of Action union)
  // Returns: A
  & (<R> (action: ((dispatch: Dispatch, getState: () => State) => R) & Thunk) => R)
  & (<A: Action> (action: A) => A)

type Store = ReduxStore<State, Action, Dispatch>

let store: Store


declare var module: any


// Enable hot reloading
if (module && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept(() => {
    // eslint-disable-next-line global-require
    const nextFactors = require('../factors').default
    store.replaceReducer(nextFactors)
  })
}

export default function (initialState: State = defaultState): Store {
  store = (createStore(
    factors,
    initialState,
    enhancer,
  ): Store)


  const { dispatch } = store

  if (LoadAuthToken(store)) {
    dispatch(Login()).then(
      (/* okay */) => dispatch(SetReady(true)),
      (/* nope */) => {
        dispatch(UpdateToken())
        dispatch(SetReady(true))
      },
    )
  } else {
    dispatch(SetReady(true))
  }


  return store
}
