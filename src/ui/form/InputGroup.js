/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'
import classnames from 'classnames'
import { Classes } from '@blueprintjs/core'
import { Label, Input } from 'ui'

import styles from './styles.scss'

export type Props = {
  className?: string,
  children: ChildrenArray<Node>;
  input: {
    name: string,
    value: string,
  },
  meta: {},
  readonly: boolean,
  disabled: boolean,
  placeholder: string,
  type: string,
}

export default class extends Component<Props> {
  static defaultProps = {
    className: '',
  }

  errorHelper(meta: any) {
    if (meta.touched && meta.error) {
      return meta.error
    }
    return ''
  }

  render() {
    return (
      <div className={ classnames(Classes.INPUT_GROUP, styles.inputGroup, this.props.className) }>
        <Label htmlFor={ this.props.input.name }>{ this.props.children }</Label>
        <span className={ Classes.FORM_HELPER_TEXT }>{ this.errorHelper(this.props.meta) }</span>
        <Input
          { ...this.props.input }
          className={ this.errorHelper(this.props.meta) && Classes.INTENT_DANGER }
          type={ this.props.type }
          placeholder={ this.props.placeholder }
          disabled={ this.props.disabled }
          readOnly={ this.props.readonly }
        />
      </div>
    )
  }
}
