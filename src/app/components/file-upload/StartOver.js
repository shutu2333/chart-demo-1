/* @flow */
import React, { Component } from 'react'
import { Button } from 'ui'
import { Popover, Position } from '@blueprintjs/core'

import styles from './styles.scss'

type Props = {
  isOpen: boolean,
  startOverInit: Function,
  startOverCancel: Function,
  startOverConfirm: Function,
}

class startOver extends Component<Props> {
  render() {
    return (
      <Popover
        isOpen={ this.props.isOpen }
        position={ Position.TOP }
        popoverClassName={ styles.popOver }
      >
        <Button
          onClick={ () => this.props.startOverInit() }
          className={ styles.startOverButton }
        >
          Go back to Step 1
        </Button>

        <div>
          <h6>Are you sure you want to start over? All progress will be lost</h6>
          <Button onClick={ () => this.props.startOverCancel() } style={ { marginRight: '4px' } }>No</Button>
          <Button onClick={ () => this.props.startOverConfirm() } style={ { marginLeft: '4px' } }>Yes</Button>
        </div>
      </Popover>
    )
  }
}

export default startOver
