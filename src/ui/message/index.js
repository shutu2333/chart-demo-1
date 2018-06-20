/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'
import style from './styles.scss'

export type Props = {
  children: ChildrenArray<Node>,
  type: 'error' | 'warning' | 'info',
}

export default class extends Component<Props> {
  render() {
    return (
      <p className={ style[this.props.type] }>{ this.props.children }</p>
    )
  }
}
