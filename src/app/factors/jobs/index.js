/* @flow */

import { type DispatchAPI } from 'redux'

import type {
  Job,
  JobDistance,
  JobElement,
} from 'tandem'

import { request } from '../../agents/api'

import { type State as StateAuth } from '../auth'
import { type State as StateNetwork } from '../network'
// import { type State as StateDatasets } from '../datasets'

// import { UpdateMessage as UpdateErrorMessage } from '../error'


export type State = {
  list: ?Array<Job>,
  distances: ?Array<JobDistance>,
  elements: { [SOCCode: string]: Array<JobElement> },
}


// Events

export const defaultState: State = {
  list: null,
  distances: null,
  elements: {}, // we download them per job/
}


const listUpdate: 'factors/jobs/list:update' = 'factors/jobs/list:update'


type ListUpdateAction = {
  type: typeof listUpdate,
  list: Array<Job>,
}

export function UpdateList(list: Array<Job>): ListUpdateAction {
  return {
    list,
    type: listUpdate,
  }
}


const distancesUpdate: 'factors/jobs/distances:update' = 'factors/jobs/distances:update'


type DistancesUpdateAction = {
  type: typeof distancesUpdate,
  distances: Array<JobDistance>,
}

export function UpdateDistances(distances: Array<JobDistance>): DistancesUpdateAction {
  return {
    distances,
    type: distancesUpdate,
  }
}


const elementsUpdate: 'factors/jobs/elements:update' = 'factors/jobs/elements:update'


type ElementsUpdateAction = {
  type: typeof elementsUpdate,
  elements: Array<JobElement>,
}

// we accept an array of job element and map it through approrpate job instead of
// calling multiple dispatch to avoid multiple rendering.
export function UpdateJobElements(elements: Array<JobElement>): ElementsUpdateAction {
  return {
    elements,
    type: elementsUpdate,
  }
}


export type Action =
  | ListUpdateAction
  | DistancesUpdateAction
  | ElementsUpdateAction


// Thunks

type GetListThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => {
    auth: StateAuth,
    network: StateNetwork,
    jobs: State,
  }
) => Promise<Array<Job>>;

export function GetList(force: boolean = false): GetListThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork, jobs: State },
  ): Promise<Array<Job>> {
    const list = getState().jobs.list
    if (!force && list) {
      return Promise.resolve(list)
    }
    return request(dispatch, getState, {
      method: 'GET',
      path: 'job-list',
      region: 'global',
    }).then(
      ({ data }: {data: Array<Job>}) => {
        dispatch(UpdateList(data))
        return Promise.resolve(data)
      },
      err => {
        throw err
      },
    )
  }
}

type GetDistancesThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<Array<JobDistance>>;

export function GetDistances(to: string): GetDistancesThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<Array<JobDistance>> {
    return request(dispatch, getState, {
      method: 'GET',
      path: 'job-distance',
      region: 'global',
      queryParams: [{ key: 'to', value: to }],
    }).then(
      ({ data }: { data: Array<JobDistance> }) => {
        dispatch(UpdateDistances(data))
        return Promise.resolve(data)
      },
      err => {
        throw err
      },
    )
  }
}

type GetElementsThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<Array<JobElement>>;

export function GetElements(...jobs: Array<string>): GetElementsThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<Array<JobElement>> {
    return request(dispatch, getState, {
      method: 'GET',
      path: 'job-elements',
      region: 'global',
      queryParams: jobs.map(soc => ({ key: 'soc[$in]', value: soc })),
    }).then(
      ({ data }: { data: Array<JobElement> }) => {
        dispatch(UpdateJobElements(data))
        return Promise.resolve(data)
      },
      err => {
        throw err
      },
    )
  }
}


export type Thunk =
  | GetListThunk
  | GetDistancesThunk
  | GetElementsThunk


export default function Jobs(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case listUpdate: {
      return {
        ...state,
        list: action.list,
      }
    }

    case distancesUpdate: {
      return {
        ...state,
        distances: action.distances,
      }
    }


    case elementsUpdate: {
      const elements = action.elements.reduce((es, e) => {
        const jes = (es[e.soc] || []).slice()
        jes.push(e)

        es[e.soc] = jes
        return es
      }, { ...state.elements })

      return {
        ...state,
        elements,
      }
    }

    default:
      return state
  }
}
