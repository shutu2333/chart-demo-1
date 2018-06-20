/* @flow */

import React, { Component } from 'react'

import {
  Button,
  Input,
  Validation,
} from 'ui'

import styles from './styles.scss'

export type Props = {
  requestPasswordReset: (string) => Promise<*>,
}

type State = {
  email: string,
  showPasswordConfirmationReset: boolean,
  validationErrors: { [string]: ?string }
}

export default class ResetPassword extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      email: '',
      validationErrors: {},
      showPasswordConfirmationReset: false,
    }
  }

  render() {
    if (this.state.showPasswordConfirmationReset) {
      return (
        <div>
          <h6 className={ styles.textCenter }>Confirmation Email Sent</h6>
          <p>
            If you did not receive the email confirmation,
            please check your spam email folder.
          </p>
        </div>
      )
    }

    const invalid = Object.values(this.state.validationErrors).filter(e => e).length > 0
    return (
      <div>
        <h6 className={ styles.textCenter }>Password Reset</h6>
        <p>Please enter your email address in the form below and we will
          email you a link to reset your password.
        </p>

        <span className={ styles.inputLabel }>Email</span>
        <Input
          name='email'
          label='Email'
          value={ this.state.email }
          onChange={ e => {
            this.setState({ email: e.target.value })
          } }
          validation={ [Validation.required()] }
          errors={ this.state.validationErrors }
          onValidationError={ (name, error) => (this.setState({
            validationErrors: { ...this.state.validationErrors, [name]: error },
          })) }
          type='text'
          placeholder='Email'
        />
        <br />
        <Button
          type='button'
          className={ styles.buttonWidth }
          width='100%'
          disabled={ invalid }
          onClick={ () => {
            if (invalid) return
            this.props.requestPasswordReset(this.state.email)
              .then(
                () => this.setState({ showPasswordConfirmationReset: true }),
              )
          } }
        >
          {'Request Password Reset'}
        </Button>
      </div>
    )
  }
}
