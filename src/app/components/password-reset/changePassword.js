/* @flow */

import React, { Component } from 'react'
import classnames from 'classnames'
import {
  Button,
  Input,
  Validation,
} from 'ui'

import styles from './styles.scss'

export type Props = {
  token: string,
  newAccount: boolean,
  changePassword: (token: string, password: string) => Promise<*>,
  onPasswordChanged: () => void,
}

type State = {
  creds: {
    password: string,
    confirmPassword: string,
  },
  validationErrors: { [string]: ?string },

  redirectTimeout: ?TimeoutID,
}

export default class ChangePassword extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      creds: {
        password: '',
        confirmPassword: '',
      },
      validationErrors: {},

      redirectTimeout: null,
    }
  }

  componentWillUnmount() {
    if (this.state.redirectTimeout) {
      clearTimeout(this.state.redirectTimeout)
    }
  }


  changePassword() {
    this.props.changePassword(this.props.token, this.state.creds.password)
      .then(
        () => {
          const redirectTimeout = setTimeout(
            () => { this.props.onPasswordChanged() },
            5000,
          )
          this.setState({ redirectTimeout })
        },
        () => this.setState({ creds: { password: '', confirmPassword: '' } }),
      )
  }

  render() {
    const invalid = Object.values(this.state.validationErrors).filter(e => e).length > 0


    if (this.state.redirectTimeout) {
      return (
        <div>
          <h6 className={ styles.textCenter }>Password Changed Successfully.</h6>
          <p>
            Your password has been successfully changed, we will redirect you to login shortly.
          </p>
        </div>
      )
    }

    return (
      <div>
        <h6 className={ styles.textCenter }>
          {
            this.props.newAccount
              ? 'Welcome To Faethm!'
              : 'Reset Your Password'
          }
        </h6>
        <p>
          {
            this.props.newAccount
              ? 'To activate your account, please choose a password for your Faethm account.'
              : 'Please select your new password.'
          }
        </p>
        <span
          className={ classnames(
            styles.inputLabel,
            { [styles.show]: this.state.creds.password },
          ) }
        >
          New Password
        </span>
        <Input
          name='Password'
          value={ this.state.creds.password }
          onChange={ e => {
            this.setState({ creds: { ...this.state.creds, password: e.target.value } })
          } }
          validation={ [Validation.required(), Validation.minLen(8)] }
          errors={ this.state.validationErrors }
          onValidationError={ (name, error) => {
            this.setState({
              validationErrors: { ...this.state.validationErrors, [name]: error },
            })
          } }
          type='password'
          placeholder='New Password'
        />
        <br />
        <span
          className={ classnames(
            styles.inputLabel,
            { [styles.show]: this.state.creds.confirmPassword },
          ) }
        >
          Confirm Password
        </span>

        <Input
          name='Confirm Password'
          value={ this.state.creds.confirmPassword }
          onChange={ e => {
            this.setState({
              creds: {
                ...this.state.creds,
                confirmPassword: e.target.value,
              },
            })
          } }
          validation={ [Validation.exactly(this.state.creds.password, 'Password')] }
          errors={ this.state.validationErrors }
          onValidationError={ (name, error) => {
            this.setState({
              validationErrors: { ...this.state.validationErrors, [name]: error },
            })
          } }
          type='password'
          placeholder='Confirm Password'
        />

        <br />
        <Button
          type='button'
          className={ styles.buttonWidth }
          width='100%'
          disabled={ invalid }
          onClick={ () => {
            if (invalid) return
            this.changePassword()
          } }
        >
          {'Change Password'}
        </Button>
      </div>
    )
  }
}
