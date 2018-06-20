/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Position, Toaster, Intent } from '@blueprintjs/core'

import type { State as StateError } from '../../factors/error'

export type Props = {
  error: { message?: string | null }
}

const toaster = Toaster.create({
  position: Position.TOP_RIGHT,
})


class Toast extends Component<Props> {
  componentDidUpdate() {
    toaster.show({
      message: this.props.error.message,
      intent: Intent.DANGER,
    })
  }

  toaster: { show: Function }

  render() {
    return (<div />)
  }
}


type State = {
  error: StateError,
}

function mapStateToProps(state: State, ownProps: *): $Shape<Props> {
  return {
    ...ownProps,
    error: state.error,
  }
}

export default connect(mapStateToProps)(Toast)
