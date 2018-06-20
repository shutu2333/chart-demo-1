/* @flow */

import {
  connect,
  type MapStateToProps,
  type MapDispatchToProps,
} from 'react-redux'
import {
  withRouter,
  type Match,
  type Location,
} from 'react-router-dom'

import type {
  Organization,
} from 'tandem'

import { type Dispatch } from '../../store'

import {
  type State as OrganizationsState,
  GetOrganizations,
} from '../../factors/organizations'

import {
  type State as NetworkState,
} from '../../factors/network'

import portal from './portal'

// This is injected by the router
type OP = {
  match: Match,
  location: Location,
}

type State = {
  organizations: OrganizationsState,
  network: NetworkState,
}


type SP = {|
  organizations: ?Array<Organization>,
  loading: number,
|}

function mapStateToProps(state: State): SP {
  return {
    organizations: state.organizations.organizations,
    loading: state.network.loading,
  }
}


type DP = {|
  GetUserOrganizations: () => Promise<Array<Organization>>,
|}

function mapDispatchToProps(dispatch: Dispatch): DP {
  return {
    GetUserOrganizations: () => {
      return dispatch(GetOrganizations())
    },
  }
}

type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

export default withRouter(connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(portal))
