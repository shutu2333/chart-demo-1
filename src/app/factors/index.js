/* @flow */
import {
  type CombinedReducer,
  combineReducers,
} from 'redux'

import uiReducer, {
  defaultState as defaultUIState,
} from './ui'

import error, {
  defaultState as defaultErrorState,
} from './error'

import store, {
  makeGlobal,
  type State as StateStore,
  type Action as ActionStore,
  defaultState as defaultStateStore,
} from './store'

import network, {
  type State as StateNetwork,
  type Action as ActionNetwork,
  defaultState as defaultStateNetwork,
} from './network'

import router, {
  type State as StateRouter,
  defaultState as defaultRouterState,
} from './router'

import auth, {
  type State as StateAuth,
  type Action as ActionAuth,
  type Thunk as ThunkAuth,

  defaultState as defaultStateAuth,
} from './auth'

import organizations, {
  type State as StateOrganizations,
  type Action as ActionOrganizations,
  type Thunk as ThunkOrganizations,
  defaultState as defaultOrganizationsState,
} from './organizations'


import datasets, {
  type State as StateDatasets,
  type Action as ActionDatasets,
  type Thunk as ThunkDatasets,
  defaultState as defaultDatasetsState,
} from './datasets'


import jobs, {
  type State as StateJobs,
  type Action as ActionJobs,
  type Thunk as ThunkJobs,
  defaultState as defaultJobsState,
} from './jobs'

export type State = {
  store: StateStore,
  network: StateNetwork,
  router: StateRouter,
  auth: StateAuth,
  organizations: StateOrganizations,
  datasets: StateDatasets,
  jobs: StateJobs,
}

export type Action =
  | ActionAuth
  | ActionNetwork
  | ActionOrganizations
  | ActionDatasets
  | ActionStore
  | ActionJobs

export type Thunk =
  | ThunkAuth
  | ThunkOrganizations
  | ThunkDatasets
  | ThunkJobs

export const defaultState: State = {
  store: defaultStateStore,
  network: defaultStateNetwork,
  router: defaultRouterState,
  error: defaultErrorState,
  ui: defaultUIState,
  auth: defaultStateAuth,
  datasets: defaultDatasetsState,
  organizations: defaultOrganizationsState,
  jobs: defaultJobsState,
}

export const combined: CombinedReducer<State, Action> = combineReducers({
  store,
  auth,
  network,
  router,
  error,
  ui: uiReducer,
  datasets,
  organizations,
  jobs,
})


const global = makeGlobal(defaultState)

export default function (state: State = defaultState, action: Action): State {
  return global(combined(state, action), action)
}
