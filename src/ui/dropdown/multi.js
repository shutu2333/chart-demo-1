/* @flow */
import React, { Component, type Element } from 'react'
import Select from 'react-select'

import { Label } from 'ui'

import styles from './styles.scss'

export type Option = {
  value: string,
  label: string | Element<*>,
  className?: string,
}

export type Options = Array<Option>


type Props = {
  label: string,
  options: Options,
  value: Options,
  onChange: (Options) => void,
  placeholder?: string,
  clearable?: boolean,
}

class Dropdown extends Component<Props> {
  static defaultProps = {
    placeholder: 'all',
    className: '',
    clearable: true,
  }

  render() {
    return (
      <div>
        <Label htmlFor=''>{ this.props.label }</Label>
        <Select
          clearable={ this.props.clearable }
          placeholder={ this.props.placeholder }
          className={ styles.select }
          multi={ true }
          value={ this.props.value }
          options={ this.props.options }
          onChange={ this.props.onChange }
        />
      </div>
    )
  }
}

export default Dropdown
