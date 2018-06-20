/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'

import { Switch as BPSwitch } from '@blueprintjs/core'

export type Props = {
  label: string | ChildrenArray<Node>,
  disabled?: boolean,
  checked: boolean,
  onChange?: (SyntheticInputEvent<*>) => void,
}

export default class Switch extends Component<Props> {
  static defaultProps = {
    disabled: false,
  }

  render() {
    return (
      <BPSwitch
        checked={ this.props.checked }
        disabled={ this.props.disabled }
        label={ this.props.label }
        onChange={ this.props.onChange }
      />
    )
  }
}
