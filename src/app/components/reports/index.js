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
  Dataset,
} from 'tandem'

import { type State as StateAuth } from '../../factors/auth'
import { type State as StateOrganizations } from '../../factors/organizations'

import {
  type State as StateDatasets,
  GetDatasets,
} from '../../factors/datasets'

import reports from './reports'


type State = {
  datasets: StateDatasets,
  organizations: StateOrganizations,
  auth: StateAuth,
}

type OP = {
  organization: Organization,
}

type SP = {
  user: User,
  datasets: ?Array<Dataset>,
}

function mapStateToProps(state: State, ownProps: OP): SP {
  // We know for certain that by this point, state.auth.user is none-null.
  const user: User = (state.auth.user: any)

  const organization = ownProps.organization

  const datasets = organization
    ? state.datasets.organizations[organization.id]
    : null

  return {
    ...ownProps,
    user,
    datasets,
  }
}

type DP = {
  getDatasets: (region: string, organizationId: string) => Promise<Array<Dataset>>
}

function mapDispatchToProps(dispatch: *, ownProps: OP): DP {
  return {
    ...ownProps,
    getDatasets: (region, organizationId) => dispatch(GetDatasets(region, organizationId)),
  }
}

type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

const connected = connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(reports)

export default withRouter(connected)
