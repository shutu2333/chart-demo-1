/* @flow */
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import Ionicon from 'react-ionicons'

import styles from './styles.scss'
import template from './Template.csv'

export type Props = {}
class Download extends PureComponent<Props> {
  render() {
    return (
      <a href={ template } className={ classnames(styles.buttons, styles.downloadButton) } download>
        <div className={ styles.roundButton }>
          <Ionicon
            icon='ion-ios-arrow-thin-down'
            fontSize='50px'
            color={ styles.primaryColor } // eslint-disable-line css-modules/no-undef-class
          />
        </div>
        <h5>Download Template</h5>
      </a>
    )
  }
}

export default Download
