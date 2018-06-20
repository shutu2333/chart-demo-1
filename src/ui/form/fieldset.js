/* @flow */
import React, { Component, type Node } from 'react'

import classnames from 'classnames'
import { Classes } from '@blueprintjs/core'
import styles from './styles.scss'

export type Props = {
  children: Node;
  className?: string,
  legend?: Node,
}

export default class extends Component<Props, {
  classes: string
}> {
  static defaultProps = {
    className: '',
  }


  render() {
    return (
      <fieldset
        className={ classnames(Classes.FORM_GROUP, styles.fieldset, this.props.className) }
      >
        {
          this.props.legend && (
            <legend
              className={ styles.legend }
            >
              <h5>{ this.props.legend }
              </h5>
            </legend>
          )
        }
        { this.props.children }
      </fieldset>
    )
  }
}
