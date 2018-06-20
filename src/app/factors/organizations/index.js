/* @flow */
import { type DispatchAPI } from 'redux'

import {
  type Organization,
  type User,
} from 'tandem'

import { request } from '../../agents/api'

import { type State as StateNetwork } from '../network'
import { type State as StateAuth } from '../auth'

export type State = {

  // user organizations
  organizations: ?Array<Organization>,
  // organization clients
  clients: { [id: string]: Array<string> },

  users: { [id: string]: Array<User> },
}

export const defaultState: State = {
  organizations: null,
  clients: {},
  users: {},
}

// Events


const organizationsUpdate: 'factor/organizations/organizations:update' = 'factor/organizations/organizations:update'

type OrganizationsUpdateAction = {
  type: typeof organizationsUpdate,
  organizations: Array<Organization>,
}

export function UpdateOrganizations(organizations: Array<Organization>): OrganizationsUpdateAction {
  return {
    type: organizationsUpdate,
    organizations,
  }
}


// TODO: Move users to their own factor.

const organizationUsersUpdate: 'factors/users/organizations/users:update' = 'factors/users/organizations/users:update'

type OrganizationUsersUpdateAction = {
  type: typeof organizationUsersUpdate,
  users: Array<User>,
  organizationId: string,
}

export function UpdateOrganizationUsers(
  orgId: string,
  newUsers: Array<User>,
): OrganizationUsersUpdateAction {
  return {
    type: organizationUsersUpdate,
    users: newUsers,
    organizationId: orgId,
  }
}

const organizationUsersUpdateUser: 'factors/users/organizations/users/user:update' = 'factors/users/organizations/users/user:update'

type OrganizationUsersUpdateUserAction = {
  type: typeof organizationUsersUpdateUser,
  user: User,
  organizationId: string,
}

export function UpdateOrganizationUsersUser(
  organizationId: string,
  user: User,
): OrganizationUsersUpdateUserAction {
  return {
    type: organizationUsersUpdateUser,
    user,
    organizationId,
  }
}

const organizationUsersAddUser: 'factors/users/organizations/users/user:add' = 'factors/users/organizations/users/user:add'

type OrganizationUsersAddUserAction = {
  type: typeof organizationUsersAddUser,
  user: User,
  organizationId: string,
}

export function AddOrganizationUsersUser(
  organizationId: string,
  user: User,
): OrganizationUsersAddUserAction {
  return {
    type: organizationUsersAddUser,
    user,
    organizationId,
  }
}


export type Action =
  | OrganizationsUpdateAction
  | OrganizationUsersUpdateAction
  | OrganizationUsersUpdateUserAction
  | OrganizationUsersAddUserAction


// Thunks


type GetOrganizationsThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<Array<Organization>>

export function GetOrganizations(/* pagination */): GetOrganizationsThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<Array<Organization>> {
    return request(dispatch, getState, {
      method: 'GET',
      path: 'organizations',
      region: 'global',
      /* query pagination */
    }).then(
      (resp: { data: Array<Organization> }) => {
        dispatch(UpdateOrganizations(resp.data))
        return Promise.resolve(resp.data)
      },
      err => {
        // only show error if using local creds, otherwise just gets redirected to login.
        // if (creds) {
        // dispatch(UpdateErrorMessage('Invalid Username or Password, please try again.'))
        // }
        throw err
      },
    )
  }
}

type GetOrganizationUsersThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<Array<User>>

export function GetOrganizationUsers(organizationId: string): GetOrganizationUsersThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<Array<User>> {
    return request(dispatch, getState, {
      method: 'GET',
      path: `organizations/${ organizationId }/users/`,
      region: 'global',
      /* query pagination */
    }).then(
      (resp: { data: Array<User> }) => {
        dispatch(UpdateOrganizationUsers(organizationId, resp.data))
        return Promise.resolve(resp.data)
      },
      err => {
        // only show error if using local creds, otherwise just gets redirected to login.
        // if (creds) {
        // dispatch(UpdateErrorMessage('Invalid Username or Password, please try again.'))
        // }
        throw err
      },
    )
  }
}

type UpdateOrganizationUsersUserThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<User>

export function PatchOrganizationUsersUser(
  organizationId: string,
  user: ($Shape<User> & {id: string}),
): UpdateOrganizationUsersUserThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<User> {
    return request(dispatch, getState, {
      method: 'PATCH',
      path: `organizations/${ organizationId }/users/${ user.id }`,
      region: 'global',
      body: user,
    }).then(
      (resp: User) => {
        dispatch(UpdateOrganizationUsersUser(organizationId, resp))
        return Promise.resolve(resp)
      },
      err => {
        throw err
      },
    )
  }
}


type AddOrganizationUsersUserThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: StateAuth, network: StateNetwork }
) => Promise<User>

export function NewOrganizationUsersUser(
  organizationId: string,
  user: ($Shape<User>),
): AddOrganizationUsersUserThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: StateAuth, network: StateNetwork },
  ): Promise<User> {
    return request(dispatch, getState, {
      method: 'POST',
      path: `organizations/${ organizationId }/users/`,
      region: 'global',
      body: user,
    }).then(
      (resp: User) => {
        dispatch(AddOrganizationUsersUser(organizationId, resp))
        return Promise.resolve(resp)
      },
      err => {
        throw err
      },
    )
  }
}


export type Thunk =
  | GetOrganizationsThunk
  | GetOrganizationUsers
  | UpdateOrganizationUsersUser
  | AddOrganizationUsersUserThunk


export default function Organizations(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case organizationsUpdate:
      return {
        ...state,
        organizations: action.organizations,
      }

    case organizationUsersUpdate:
      return {
        ...state,
        users: {
          ...state.users,
          [action.organizationId]: action.users,
        },
      }

    case organizationUsersUpdateUser: {
      const { user } = action
      return {
        ...state,
        users: {
          ...state.users,
          [action.organizationId]: state.users[action.organizationId]
            .map(u => (u.id === user.id ? user : u)),
        },
      }
    }

    case organizationUsersAddUser: {
      const { user } = action
      const users = state.users[action.organizationId].slice()
      users.push(user)
      return {
        ...state,
        users: {
          ...state.users,
          [action.organizationId]: users,
        },
      }
    }

    default:
      return state
  }
}
