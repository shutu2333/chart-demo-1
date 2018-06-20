/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'
import { connect } from 'react-redux'
import Ionicon from 'react-ionicons'
import { Button } from '@blueprintjs/core'
import classnames from 'classnames'

import { hasFilter } from '../../factors/ui'

import styles from './styles.scss'

type State = {
  open: boolean,
}

type Props = {
  children: ChildrenArray<Node>;
  hasFilter: Function,
}

class Filter extends Component<Props, State> {
  constructor() {
    super()
    this.state = { open: false }
  }

  componentWillMount() {
    this.props.hasFilter(true)
  }

  componentWillUnmount() {
    this.props.hasFilter(false)
  }

  toggleFilterPanel() {
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div>
        <div className={ classnames(styles.filterPanel, this.state.open ? 'open' : '') }>
          <Button onClick={ () => { this.toggleFilterPanel() } } className={ styles.filterButton }>
            <div>
              <Ionicon
                icon={ this.state.open ? 'ion-ios-close-empty' : 'ion-ios-settings-strong' }
                fontSize={ this.state.open ? '48px' : '26px' }
                color={ styles.white } // eslint-disable-line css-modules/no-undef-class
              />
            </div>
          </Button>

          <h3>Filter Your Results</h3>
          <p>Filter your data by selecting your priorities:</p>

          <div className={ styles.filters }>
            { this.props.children }
          </div>

          <Button
            className={ styles.applyFilters }
            onClick={ () => { this.toggleFilterPanel() } }
          >
            { 'Done' }
          </Button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch: *): $Shape<Props> {
  return {
    hasFilter: (value) => {
      return dispatch(hasFilter(value))
    },
  }
}

export default connect(null, mapDispatchToProps)(Filter)
