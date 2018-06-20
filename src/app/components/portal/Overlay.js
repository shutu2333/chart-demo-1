/* @flow */
import React, { Component } from 'react'
import Ionicon from 'react-ionicons'

import styles from './styles.scss'

type Props = {
  showOverlay: boolean
}

export default class Overly extends Component<Props> {
  render() {
    if (this.props.showOverlay) {
      return (
        <div className={ styles.loadingOverlay }>
          <Ionicon icon='ion-load-c' fontSize='30px' color='#ffffff' />
        </div>
      )
    }
    return <div />
  }
}
