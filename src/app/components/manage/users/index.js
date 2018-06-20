/* @flow */

import {
  connect,
  type MapStateToProps,
  type MapDispatchToProps,
} from 'react-redux'

import {
  withRouter,
} from 'react-router'

import type {
  User,
  Organization,
} from 'tandem'

import {
  type State as StateAuth,
} from '../../../factors/auth'

import {
  type State as StateOrganizations,
  GetOrganizationUsers,
  PatchOrganizationUsersUser,
  NewOrganizationUsersUser,
} from '../../../factors/organizations'

// import React, { Component } from 'react'
import users from './users'


type State = {
  organizations: StateOrganizations,
  auth: StateAuth,
}

type OP = {
  organization: Organization,
}

type SP = {
  user: User,
  users: ?Array<User>,
}

function mapStateToProps(state: State, ownProps: OP): SP {
  // We know for certain that by this point, state.auth.user is none-null.
  const user: User = (state.auth.user: any)

  const organization = ownProps.organization

  const us = state.organizations.users[organization.id]

  return {
    ...ownProps,
    user,
    users: us && us.slice(),
    organization,
  }
}

type DP = {
  getUsers: (organizationId: string) => Promise<Array<User>>,
  updateUser: (string, $Shape<User> & {id: string}) => Promise<User>,
  addNewUser: (string, $Shape<User>) => Promise<User>

}

function mapDispatchToProps(dispatch: *): DP {
  return {
    getUsers: (organizationId) => dispatch(GetOrganizationUsers(organizationId)),
    updateUser: (organizationId, user) => {
      return dispatch(PatchOrganizationUsersUser(organizationId, user))
    },
    addNewUser: (organizationId, user) => {
      return dispatch(NewOrganizationUsersUser(organizationId, user))
    },
  }
}

type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

const connected = connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(users)

export default withRouter(connected)
