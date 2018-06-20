/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'

import classnames from 'classnames'

import { Classes } from '@blueprintjs/core'

import styles from './styles.scss'


export type Props = {
  children: ChildrenArray<Node>;

  className?: string;
}

export default class extends Component<Props, {
  classes: string
}> {
  static defaultProps = {
    className: '',
  }

  render() {
    return (
      <div
        className={ classnames(Classes.CARD, styles.card, this.props.className) }
      >
        {this.props.children}
      </div>
    )
  }
}
