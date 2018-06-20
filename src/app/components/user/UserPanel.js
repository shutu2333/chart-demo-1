/* @flow */
import React, { Component } from 'react'
import { connect, type MapDispatchToProps } from 'react-redux'
import {
  withRouter,
  type Location,
  type RouterHistory,
} from 'react-router-dom'

import { Menu, MenuItem } from '@blueprintjs/core'
import type { Organization } from 'tandem'

import { Logout } from '../../factors/auth'
import type { Dispatch } from '../../store'

import styles from '../layout/styles.scss'

export type Props = {
  logout: () => Promise<null>,
  openOrganizationsPrompt: () => void,

  // organizations: Array<Organization>,
}

class UserPanel extends Component<Props> {
  logout() {
    this.props.logout().then(
      () => {},
      (reason) => {
        console.log(reason) // eslint-disable-line no-console
      },
    )
  }

  render() {
    return (
      <Menu className={ styles.panel }>
        <MenuItem
          onClick={ () => this.props.openOrganizationsPrompt() }
          text='Organisations'
        />
        <MenuItem
          onClick={ () => this.props.logout() }
          text='Log Out'
        />
      </Menu>
    )
  }
}

type OP = {
  location: Location,
  history: RouterHistory,
  organizations: Array<Organization>,
}

type DP = {
  logout: () => Promise<null>,
  openOrganizationsPrompt: () => void,
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: OP): DP {
  const history = ownProps.history
  const location = ownProps.location

  return {
    logout: () => {
      history.replace({
        ...location,
        state: {
          ...location.state,
          logout: true,
        },
      })
      return dispatch(Logout())
    },

    openOrganizationsPrompt: () => history.replace({
      ...location,
      state: {
        ...location.state,
        showOrganizationPrompt: true,
      },
    }),
  }
}


type MDTP = MapDispatchToProps<*, OP, DP>
export default withRouter(connect(null, (mapDispatchToProps: MDTP))(UserPanel))
