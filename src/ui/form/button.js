/* @flow */

import React, { Component, type Node, type ChildrenArray } from 'react'
import classnames from 'classnames'

import { Classes } from '@blueprintjs/core'

import styles from './styles.scss'

export type Props = {
  children: ChildrenArray<Node>,
  className?: string,
  disabled?: boolean,
}

export default class extends Component<Props> {
  static defaultProps = {
    className: '',
    disabled: false,
  }

  render() {
    return (
      <button
        { ...this.props }
        className={ classnames(Classes.BUTTON, styles.button, this.props.className) }
        disabled={ this.props.disabled }
      > { this.props.children }
      </button>
    )
  }
}
