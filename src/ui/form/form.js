/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'

import styles from './styles.scss'


export type Props = {
  children: ChildrenArray<Node>;
}

export default class extends Component<Props> {
  render() {
    return (
      <form className={ styles.form } > {this.props.children} </form>
    )
  }
}
