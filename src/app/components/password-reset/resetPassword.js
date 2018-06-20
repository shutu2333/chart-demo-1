/* @flow */

import React, { Component } from 'react'

import {
  type Match,
  type RouterHistory,
} from 'react-router-dom'

import { Flex } from 'ui'

import FaethmLogo from '../../assets/img/Faethm_Logo.svg'
import styles from './styles.scss'

import RequestReset from './requestReset'
import ChangePassword from './changePassword'

export type Props = {
  match: Match,
  requestPasswordReset: (string) => Promise<*>,
  changePassword: (string, string) => Promise<*>,
  history: RouterHistory,
}

type State = {
  creds: {
    email: string,
    password: string,
    confirmPassword: string,
  },
  showPasswordConfirmationReset: boolean,

  validationErrors: { [string]: ?string }
  // UpdateErrorMessage: null | string | Element<any>
}

export default class ResetPassword extends Component<Props, State> {
  render() {
    const { token } = this.props.match.params
    const { path } = this.props.match

    const newAccount = path === '/account/activate/:token'
    const requestReset = !token

    return (
      <Flex
        flexGrow={ 1 }
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        className={ styles.flexCenter }
      >
        <div className={ styles.resetCard } >
          <Flex flexGrow={ 1 } flexDirection='row' justifyContent='center' alignItems='center'>
            <img src={ FaethmLogo } alt='Faethm logo' className={ styles.logoFaethm } />
          </Flex>
          {
            requestReset
              ? (
                <RequestReset
                  requestPasswordReset={ this.props.requestPasswordReset }
                />
              ) : (
                <ChangePassword
                  changePassword={ this.props.changePassword }
                  token={ token }
                  newAccount={ newAccount }
                  onPasswordChanged={ () => this.props.history.push('/login') }
                />
              )
          }
        </div>
      </Flex>
    )
  }
}
