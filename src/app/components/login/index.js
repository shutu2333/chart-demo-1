/* @flow */

// import React, { Component } from 'react'
import { connect } from 'react-redux'
import { type LocationShape } from 'react-router'
import { withRouter } from 'react-router-dom'

import type { User, Credentials } from 'tandem'
import login, { type Props } from './login'

import { type State as NetworkState } from '../../factors/network'
import { Login, type State as AuthState } from '../../factors/auth'

import type { Dispatch } from '../../store'

type State = {
  auth: AuthState,
  network: NetworkState,
}

type ownProps = {
  location: {
    state: {
      from: LocationShape,
      logout: boolean,
    }
  }
}

type stateProps = {
  login: (Credentials) => Promise<User>,
  user: ?User,
  onLoginRedirect: LocationShape,
  requestInFlight: boolean,
}

type dispatchProps = {
  login: (Credentials) => Promise<User>,
}

const home = { from: { pathname: '/' } }

function mapStateToProps(state: State, op: ownProps): $Diff<Props, dispatchProps> {
  let { from } = op.location.state || home

  if (from.pathname === '/login' || (from.state && from.state.logout)) {
    from = home.from
  }

  return {
    onLoginRedirect: from,
    requestInFlight: state.network.loading > 0,
    token: state.auth.token,
    user: state.auth.user,
  }
}

function mapDispatchToProps(dispatch: Dispatch): $Diff<Props, stateProps> {
  return {
    login: (creds: Credentials): Promise<User> => {
      return dispatch(Login(creds))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(login))
