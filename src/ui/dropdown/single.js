/* @flow */
import React, { Component, type Element } from 'react'
import Select from 'react-select'

import { Label } from 'ui'

import styles from './styles.scss'

import type { Option, Options } from './multi'

type Props = {
  label: string | Element<*>,
  options: Options,
  value: string,
  onChange: (Option) => void,
  placeholder?: string,
  clearable?: boolean,
}

class DropdownSingle extends Component<Props> {
  static defaultProps = {
    placeholder: 'all',
    className: '',
    clearable: true,
  }

  render() {
    return (
      <div>
        <Label htmlFor='' className={ styles.label }>{ this.props.label }</Label>
        <Select
          clearable={ this.props.clearable }
          placeholder={ this.props.placeholder }
          className={ styles.select }
          multi={ false }
          value={ this.props.value }
          options={ this.props.options }
          onChange={ this.props.onChange }
        />
      </div>
    )
  }
}

export default DropdownSingle
