/* @flow */
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Classes } from '@blueprintjs/core'
import { Message } from '../'

import styles from './styles.scss'

export type Props = {
  className?: string,
  name: string,
  value: string,
  label?: string,

  onChange?: (SyntheticInputEvent<*>) => void,

  errors?: { [string]: ?string },
  validation?: Array<(string, string) => string | null>,
  onValidationError?: (string, ?string) => void,
}

type State = {
  touched: boolean,
  dirty: boolean,
}
export default class Input extends PureComponent<Props, State> {
  static defaultProps = {
    className: '',
    name: '',
  }

  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      touched: false,
      dirty: false,
    }
  }

  render() {
    const {
      validation,
      errors,
      onValidationError,
      ...rest
    } = this.props

    const validationRule =
      validation &&
      validation.find(validator => validator(this.props.name, this.props.value))

    const error = validationRule ? validationRule(this.props.name, this.props.value) : null

    if (
      errors && onValidationError &&
      error !== errors[this.props.name]
    ) onValidationError(this.props.name, error)

    return (
      <div>
        <span
          className={ classnames(
            styles.hidden,
            { [styles.show]: this.props.value },
          ) }
        >
          { this.props.label }
        </span>
        <input
          { ...rest }
          className={ classnames(Classes.INPUT, styles.input, this.props.className) }
          id={ this.props.name }
          onChange={ (e: SyntheticInputEvent<*>) => {
            this.setState({ touched: true })
            if (this.props.onChange) this.props.onChange(e)
          } }
          onBlur={ () => this.setState({ dirty: this.state.touched }) }
        />
        {
          (
            this.state.touched &&
            this.state.dirty &&
            error
          )
          ? <Message type='error'>{ error }</Message>
          : null
        }
      </div>
    )
  }
}
