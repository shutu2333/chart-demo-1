/* @flow */

import React, { Component } from 'react'
import { type LocationShape } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import classnames from 'classnames'

import type { User, Credentials } from 'tandem'

import {
  Flex,
  FieldSet,
  Button,
  Input,
} from 'ui'

// import { type Location } from '../../factors/router'

import FaethmLogo from '../../assets/img/Faethm_Logo.svg'
import styles from './styles.scss'

export type Props = {
  login: (Credentials) => Promise<User>,
  user: ?User,
  onLoginRedirect: LocationShape,
  requestInFlight: boolean,
}

type State = {
  creds: Credentials,
  // UpdateErrorMessage: null | string | Element<any>
}

export default class Login extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      creds: {
        email: '',
        password: '',
      },

      // UpdateErrorMessage: null,
    }
  }

  render() {
    if (this.props.user) {
      return (
        <Redirect
          to={ this.props.onLoginRedirect }
        />
      )
    }

    return (

      <Flex flexGrow={ 1 } flexDirection='row' justifyContent='center' alignItems='center' className={ styles.flexCenter }>
        <div className={ styles.loginCard } >
          <form>
            <Flex flexGrow={ 1 } flexDirection='row' justifyContent='center' alignItems='center'>
              <img src={ FaethmLogo } alt='Faethm logo' className={ styles.logoLogin } />
            </Flex>
            <br />
            <FieldSet className='pt-intent-danger'>
              <span
                className={ classnames(
                            styles.inputLabel,
                            { [styles.showClassName]: !!this.state.creds.email },
                          ) }
              >
                Email
              </span>
              <div>
                <Input
                  name='email'
                  value={ this.state.creds.email }
                  onChange={ e => {
                    this.setState({
                      creds: { ...this.state.creds, email: e.target.value.toLowerCase() },
                    })
                  } }
                  type='text'
                  placeholder='Email'
                />
              </div>
              <br />
              <span
                className={ classnames(
                            styles.inputLabel,
                            { [styles.showClassName]: !!this.state.creds.password },
                          ) }
              >
                Password
              </span>
              <Input
                name='password'
                value={ this.state.creds.password }
                onChange={ e => {
                  this.setState({ creds: { ...this.state.creds, password: e.target.value } })
                } }
                type='password'
                placeholder='Password'
              />
            </FieldSet>

            <Flex flexGrow={ 1 } flexDirection='row' justifyContent='center' alignItems='center'>
              <Link to='/account/reset-password'>Forgot password?</Link>
            </Flex>
            <br />
            <div className={ styles['align-center'] }>
              <Button
                type='button'
                disabled={ this.props.requestInFlight }
                onClick={ () => this.props.login(this.state.creds) }
                className={ styles.buttonWidth }
                width='100%'
              >
                Log In
              </Button>
            </div>
          </form>
        </div>
      </Flex>
    )
  }
}

/*
export const validate = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must have at least 8 characters'
  }

  return errors
}
*/
