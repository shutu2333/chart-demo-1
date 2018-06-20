/* @flow */
import React, { Component } from 'react'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

// import type { User } from 'tandem'

import { history } from '../../factors/router'

import Login from '../login'
import PasswordReset from '../password-reset'

import Portal from '../portal'

import { ProtectedRoute } from './protected'

type Props = {}

export default class router extends Component<Props> {
  render() {
    return (
      <ConnectedRouter history={ history }>
        <Switch>
          <Route exact path='/login' component={ Login } />
          <Route exact path='/account/reset-password/:token?' component={ PasswordReset } />
          <Route exact path='/account/activate/:token' component={ PasswordReset } />
          { /* /reset-password ? on login? */ }
          { /* /welcome? set password? */ }
          <ProtectedRoute path='/:organizationSlug?' component={ Portal } />
        </Switch>
      </ConnectedRouter>
    )
  }
}
