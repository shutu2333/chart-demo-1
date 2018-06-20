/* @flow */
import { applyMiddleware, type Store, type DispatchAPI } from 'redux'

import type { User, Credentials } from 'tandem'
import { request } from '../../agents/api'
import { type State as StateNetwork } from '../network'
import { reset, Reset, type ResetAction } from '../store'
import { UpdateMessage as UpdateErrorMessage, type Action as ErrorAction } from '../error'

// import Store from '../store'
// import { getCurrentOrganization } from '../organizations'

export type State = {
  token: ?string,
  user: ?User,
}

export const defaultState: State = {
  token: null,
  user: null,
}

// Events


const tokenUpdate: 'factor/auth/token:update' = 'factor/auth/token:update'

type TokenUpdateAction = { type: typeof tokenUpdate, token: ?string }

export function UpdateToken(token: ?string): TokenUpdateAction {
  return {
    type: tokenUpdate,
    token,
  }
}

const userUpdate: 'factor/auth/user:update' = 'factor/auth/user:update'
type UserUpdateAction = { type: typeof userUpdate, user: ?User}

export function UpdateUser(user: User): UserUpdateAction {
  return {
    type: userUpdate,
    user,
  }
}


export type Action =
  | TokenUpdateAction
  | UserUpdateAction
  | ResetAction
  | ErrorAction


// Thunks


type LogoutEventThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: State, network: StateNetwork }
) => Promise<null>

export function Logout(): LogoutEventThunk {
  return function (dispatch: DispatchAPI<Action>): Promise<null> {
    return new Promise(resolve => {
      dispatch(UpdateToken())
      dispatch(Reset())
      resolve(null)
    })
  }
}

type LoginEventThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: State, network: StateNetwork }
) => Promise<User>

type loginResponse = {
  profile: User,
  accessToken: string,
}

export function Login(creds?: Credentials): LoginEventThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: State, network: StateNetwork },
  ): Promise<User> {
    return request(dispatch, getState, {
      method: 'POST',
      path: 'authentication',
      body: { ...creds, strategy: creds ? 'local' : 'jwt' },
      region: 'global',
    }).then(
      (resp: loginResponse) => {
        dispatch(UpdateToken(resp.accessToken))
        dispatch(UpdateUser(resp.profile))
        return Promise.resolve(resp.profile)
      },
      err => {
        // only show error if using local creds, otherwise just gets redirected to login.
        if (creds) dispatch(UpdateErrorMessage('Invalid Username or Password, please try again.'))
        throw err
      },
    )
  }
}

type statusResponse = {
  status: string,
}

type RequestPasswordResetEventThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: State, network: StateNetwork }
) => Promise<statusResponse>

export function RequestPasswordReset(email: string): RequestPasswordResetEventThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: State, network: StateNetwork },
  ): Promise<statusResponse> {
    return request(dispatch, getState, {
      method: 'DELETE',
      path: 'accounts/password',
      queryParams: [{ key: 'email', value: email }],
      region: 'global',
    }).then(
      (resp: statusResponse) => {
        return Promise.resolve(resp)
      },
      err => {
        dispatch(UpdateErrorMessage('Password Reset Request Failed, please try again.'))
        throw err
      },
    )
  }
}

type ChangeAccountPasswordEventThunk = (
  dispatch: DispatchAPI<Action>,
  getState: () => { auth: State, network: StateNetwork }
) => Promise<statusResponse>

export function ChangePassword(token: string, password: string): ChangeAccountPasswordEventThunk {
  return function (
    dispatch: DispatchAPI<Action>,
    getState: () => { auth: State, network: StateNetwork },
  ): Promise<statusResponse> {
    return request(dispatch, getState, {
      method: 'POST',
      path: 'accounts/password',
      region: 'global',
      body: {
        token,
        password,
      },
    }).then(
      (resp: statusResponse) => {
        return Promise.resolve(resp)
      },
      err => {
        const error = err.status === 401
          ? 'Invalid or Expired Token, please request a new password reset email'
          : 'Something went wrong, please try again'
        dispatch(UpdateErrorMessage(error))
        throw err
      },
    )
  }
}

export type Thunk =
  | LoginEventThunk
  | LogoutEventThunk
  | RequestPasswordResetEventThunk
  | ChangeAccountPasswordEventThunk


export default function Auth(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case tokenUpdate:
      return {
        ...state,
        token: action.token,
      }

    case userUpdate:
      return {
        ...state,
        user: action.user,
      }

    default:
      return state
  }
}

const localStorageAccessKey = 'access_token'

export const PersistAuthToken = applyMiddleware((/* store */) => next => action => {
  if (action && action.type === tokenUpdate) {
    if (action.token) {
      localStorage.setItem(localStorageAccessKey, action.token)
    } else {
      localStorage.removeItem(localStorageAccessKey)
    }
  }

  if (action.type === reset) {
    localStorage.removeItem(localStorageAccessKey)
  }

  return next(action)
})

export function LoadAuthToken<D: DispatchAPI<Action>>(store: Store<*, *, D>): boolean {
  const token = localStorage.getItem(localStorageAccessKey)

  if (!token) {
    return false
  }
  store.dispatch(UpdateToken(token))
  return true
}
