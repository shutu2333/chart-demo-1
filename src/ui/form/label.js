/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'
import classnames from 'classnames'
import { Classes } from '@blueprintjs/core'

import styles from './styles.scss'

export type Props = {
  className?: string,
  children: ChildrenArray<Node>;
  htmlFor: string,
}

export default class extends Component<Props> {
  static defaultProps = {
    className: '',
  }

  render() {
    return (
      // TODO: check this everywhere used properly with an element that has ID.
      // eslint-disable-next-line jsx-a11y/label-has-for
      <label
        className={ classnames(Classes.LABEL, styles.label, this.props.className) }
        htmlFor={ this.props.htmlFor }
      >
        { this.props.children }
      </label>
    )
  }
}
