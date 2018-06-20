/* @flow */
import {
  connect,
  type MapStateToProps,
  type MapDispatchToProps,
} from 'react-redux'
import {
  withRouter,
  type Match,
} from 'react-router'


import type {
  User,
  Organization,
  Job,
  Dataset,
  JobDistance,
  JobElement,
} from 'tandem'

import type { Dispatch } from '../../../store'

import { type State as AuthState } from '../../../factors/auth'
import { type State as StateOrganizations } from '../../../factors/organizations'
import {
  type State as JobsState,
  GetList,
  GetDistances,
  GetElements,
} from '../../../factors/jobs'


import jobCorridor from './jobCorridor'

type State = {
  auth: AuthState,
  organizations: StateOrganizations,
  jobs: JobsState,
}


type OP = {
  match: Match,
  dataset: Dataset,
}

type SP = {
  user: User,
  organization: Organization,
  jobList: ?Array<Job>,
}

function mapStateToProps(state: State, ownProps: OP): SP {
  const { organizationSlug } = ownProps.match.params

  // we shouldn't be even trying to render this component without company.
  const organization = (organizationSlug && state.organizations.organizations)
    ? state.organizations.organizations.find(e => e.slug === organizationSlug)
    : {}

  return {
    user: (state.auth.user: any),
    organization: (organization: any),
    jobList: state.jobs.list,
  }
}

type DP = {
  GetJobList: () => Promise<Array<Job>>,
  GetDistances: (string) => Promise<Array<JobDistance>>,
  GetElements: (...jobs: Array<string>) => Promise<Array<JobElement>>,
}

function mapDispatchToProps(dispatch: Dispatch): DP {
  return {
    GetJobList: () => dispatch(GetList()),
    GetElements: (...job) => dispatch(GetElements(...job)),
    GetDistances: to => dispatch(GetDistances(to)),
  }
}


type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

const connected = connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(jobCorridor)

export default withRouter(connected)
