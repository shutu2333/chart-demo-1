/* @flow */
import React, { Component, type ComponentType } from 'react'
import { connect, type MapStateToProps } from 'react-redux'

import {
  Route,
  Redirect,
  withRouter,
  type Location,
} from 'react-router-dom'

import type { User } from 'tandem'
import { type State as AuthState } from '../../factors/auth'

type ownProps = {
  location: Location,
  path: string,
  exact?: boolean,
  userCondition?: (User) => boolean,
  component: ComponentType<*>,
}

type Props = {
  location: Location,
  path: string,
  exact?: boolean,
  userCondition: (User) => boolean,
  component: ComponentType<*>,
  allow: boolean,
}

export class protectedRoute extends Component<Props> {
  render() {
    const { component: Comp, ...rest } = this.props

    return (
      <Route
        { ...rest }
        render={ (props) => {
          if (!this.props.allow) {
            return (
              <Redirect
                to={ {
                  pathname: '/login',
                  state: { from: props.location },
                } }
              />
            )
          }

          return <Comp { ...props } />
        } }
      />
    )
  }
}


type AppState = {
  auth: AuthState,
}


function mapStateToProps(state: AppState, op: ownProps): Props {
  const { user } = state.auth
  const cond = op.userCondition

  const allow : boolean = !!user && (cond ? cond(user) : true)

  return {
    ...op,
    allow,
  }
}

const connector = connect((mapStateToProps: MapStateToProps<AppState, ownProps, Props>))
export const ProtectedRoute = withRouter(connector(protectedRoute))
