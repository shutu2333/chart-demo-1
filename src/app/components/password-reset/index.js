/* @flow */
import {
  connect,
  type MapStateToProps,
  type MapDispatchToProps,
} from 'react-redux'

import { type Match, type RouterHistory, withRouter } from 'react-router-dom'

import resetPassword from './resetPassword'

import { RequestPasswordReset, ChangePassword } from '../../factors/auth'

import type { Dispatch } from '../../store'

type State = {}

type OP = {
  match: Match,
  history: RouterHistory,
}

type SP = {
}

type DP = {
  requestPasswordReset: (email: string) => Promise<*>,
  changePassword: (token: string, password: string) => Promise<*>,
}

function mapStateToProps(state: State, op: OP): SP {
  return {
    ...op,
  }
}

function mapDispatchToProps(dispatch: Dispatch): DP {
  return {
    requestPasswordReset: (email: string) => dispatch(RequestPasswordReset(email)),
    changePassword: (token, password) => dispatch(ChangePassword(token, password)),
  }
}

type MSTP = MapStateToProps<State, OP, SP>
type MDTP = MapDispatchToProps<*, OP, DP>

export default withRouter(connect(
  (mapStateToProps: MSTP),
  (mapDispatchToProps: MDTP),
)(resetPassword))
