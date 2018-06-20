/* @flow */
import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import classnames from 'classnames'
import { Flex } from 'ui'

import styles from './styles.scss'

type Props = {
  step: number,
  visiblePanel: number,
  setActiveClass: Function,
  openPanel: Function,
  heading: string,
  className?: any
}

class StepButton extends Component<Props> {
  static defaultProps = {
    className: '',
  }

  render() {
    return (
      <Flex alignItems='flex-start' className={ this.props.className }>
        <Button
          disabled={ this.props.visiblePanel !== this.props.step }
          className={ classnames(styles.stepButton, this.props.setActiveClass(this.props.step)) }
          onClick={ () => { this.props.openPanel(this.props.step) } }
        >Step { this.props.step }
        </Button>
        <h4 className={ styles.heading }>{ this.props.heading }</h4>
      </Flex>
    )
  }
}

export default StepButton
