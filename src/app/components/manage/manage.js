/* @flow */
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import {
  type Organization,
} from 'tandem'

import Users from './users'

type Props = {
  organization: Organization,
}

export default class router extends Component<Props> {
  render() {
    return (
      <Switch>
        <Route
          key='manage'
          path='/:organizationSlug/manage'
          render={ (/* props: ContextRouter */) => (
            <Users organization={ this.props.organization } />
          ) }
        />
      </Switch>
    )
  }
}
