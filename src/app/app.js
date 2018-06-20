/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { Classes } from '@blueprintjs/core'
import 'what-input'
import reactFastClick from 'react-fastclick'

import 'ui/theme/index.scss'
import styles from './styles.scss'

import { type State as StoreState } from './factors/store'
import Toast from './components/toaster'
import Router from './components/router'

reactFastClick()

export type ownProps = {}

export type stateProps = {
  ready: boolean,
}

export type Props = ownProps & stateProps

export class CoreApp extends Component<Props> {
  render() {
    const ready = this.props.ready

    if (!ready) {
      return <div />
    }

    return (
      <div className={ Classes.DARK }>
        <main className={ styles.app }>
          <Router />
          <Toast />
        </main>
      </div>
    )
  }
}


type State = {
  store: StoreState,
}

function mapStateToProps(state: State, op: ownProps): Props {
  return {
    ...op,
    ready: state.store.ready,
  }
}

export default hot(module)(connect(mapStateToProps)(CoreApp))
