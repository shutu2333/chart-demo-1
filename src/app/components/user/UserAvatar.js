/* @flow */
import React, { Component } from 'react'
import classnames from 'classnames'

import type { User } from 'tandem'

import styles from './styles.scss'

export type Props = {
  user: ?User,
}

class UserAvatar extends Component<Props> {
  userInitials(): string {
    const user = this.props.user

    if (!user) return '' // should never happen.

    return `${ user.firstName.charAt(0) }${ user.lastName.charAt(0) }`
  }

  render() {
    return (
      <div className={ classnames(styles.avatar, 'avatar') }>{ this.userInitials() }</div>
    )
  }
}

export default UserAvatar
