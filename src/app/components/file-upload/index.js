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
} from 'tandem'

import type { Dispatch } from '../../store'

import { UpdateMessage as UpdateErrorMessage } from '../../factors/error'
import { type State as AuthState } from '../../factors/auth'
import { type State as StateOrganizations } from '../../factors/organizations'
import { type State as JobsState, GetList } from '../../factors/jobs'

import {
  type State as DatasetsState,
  type DatasetInput,
  AddNewDataset,
} from '../../factors/datasets'


import fileUpload from './FileUpload'

type State = {
  auth: AuthState,
  organizations: StateOrganizations,
  datasets: DatasetsState,
  jobs: JobsState,
}


type OP = {
  match: Match,
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
  UpdateErrorMessage: (?string) => *,
  AddNewDataset: (region: string, DatasetInput) => Promise<*>,
}

function mapDispatchToProps(dispatch: Dispatch): DP {
  return {
    GetJobList: () => dispatch(GetList()),
    UpdateErrorMessage: message => dispatch(UpdateErrorMessage(message)),
    AddNewDataset: (region: string, nd) => dispatch(AddNewDataset(region, nd)),
  }
}


type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

const connected = connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(fileUpload)

export default withRouter(connected)
