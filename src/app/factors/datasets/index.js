/* @flow */

import { type DispatchAPI } from 'redux'

import type {
  Dataset,
} from 'tandem'

import { type State as StateAuth } from '../auth'
import { type State as StateNetwork } from '../network'
import { UpdateMessage as UpdateErrorMessage } from '../error'
import { request } from '../../agents/api'

export type State = {
  organizations: { [string]: Array<Dataset> },
}

export const defaultState: State = {
  organizations: {},
}

const organizationsDatasetsUpdate: 'factors/datasets/organizations/datasets:update' = 'factors/datasets/organizations/datasets:update'

type OrganizationDatasetUpdateAction = {
  type: typeof organizationsDatasetsUpdate,
  datasets: Array<Dataset>,
  organizationId: string,
}

export function UpdateDatasets(
  orgId: string,
  newDatasets: Array<Dataset>,
): OrganizationDatasetUpdateAction {
  return {
    type: organizationsDatasetsUpdate,
    datasets: newDatasets,
    organizationId: orgId,
  }
}

const datasetsAdd: 'factors/datasets/datasets:add' = 'factors/datasets/datasets:add'

type DatasetsAddAction = {
  type: typeof datasetsAdd,
  dataset: Dataset,
}

export function AddDataset(newDataset: Dataset): DatasetsAddAction {
  return {
    type: datasetsAdd,
    dataset: newDataset,
  }
}


export type Action =
  | OrganizationDatasetUpdateAction
  | DatasetsAddAction


type GetDatasetsEventThunk = (
  dispatch: *,
  getState: () => { auth: StateAuth, network: StateNetwork, datasets: State }
) => Promise<Array<Dataset>>

export function GetDatasets(
  region: string,
  organizationId: string,
  force: boolean = false,
): GetDatasetsEventThunk {
  return function (
    dispatch: *,
    getState: () => { auth: StateAuth, network: StateNetwork, datasets: State },
  ): Promise<Array<Dataset>> {
    const ds = getState().datasets.organizations[organizationId]

    if (!force && ds) {
      return Promise.resolve(ds)
    }

    return request(
      dispatch,
      getState,
      {
        method: 'GET',
        path: `organizations/${ organizationId }/datasets/`,
        queryParams: [{ key: '$limit', value: '1' }, { key: '$sort[createdAt]', value: '-1' }],
        region,
      },
    ).then(
      ({ data }: { data: Array<Dataset>}) => {
        dispatch(UpdateDatasets(organizationId.toString(), data))
        return data
      },
      err => {
        dispatch(UpdateErrorMessage('Cannot get datasets'))
        throw err
      },
    )
  }
}

export type DatasetInput = {
  name: string,
  organizationId: string,
  employeeData: Array<any>
}

type AddDatasetEventThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<Dataset>

export function AddNewDataset(region: string, dataset: DatasetInput): AddDatasetEventThunk {
  return function (
    dispatch: *,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<Dataset> {
    return request(
      dispatch,
      getState,
      {
        method: 'POST',
        contentType: 'application/json',
        path: `organizations/${ dataset.organizationId }/datasets/`,
        body: dataset,
        region,
      },
    ).then(
      (data: Dataset) => {
        dispatch(AddDataset(data))
        return data
      },

      err => {
        // dispatch(UpdateErrorMessage('Cannot process company data'))
        throw err
      },
    )
  }
}

export type Thunk =
  | GetDatasetsEventThunk
  | AddDatasetEventThunk


export default function datasets(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case organizationsDatasetsUpdate:
      return {
        ...state,
        organizations: {
          ...state.organizations,
          [action.organizationId]: action.datasets,
        },
      }

    case datasetsAdd:
    {
      const organizationId = action.dataset.organizationId
      const ds = state.organizations[organizationId] || []
      return {
        ...state,
        organizations: {
          ...state.organizations,
          [organizationId]: [...ds, action.dataset],
        },
      }
    }

    default:
      return state
  }
}
