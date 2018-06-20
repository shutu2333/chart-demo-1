/* @flow */
import React, { Component, type Element } from 'react'
import { Flex } from 'ui'

import styles from './styles.scss'

type Props = {
  title?: string,
  description?: string | Element<*>,
}

class Header extends Component<Props> {
  static defaultProps = {
    title: '',
    description: '',
  };

  render() {
    return (
      <Flex className={ styles.header }>
        <div>
          <h1>
            { this.props.title }
          </h1>
          { this.props.description ? <h6>{ this.props.description }</h6> : '' }
        </div>
      </Flex>
    )
  }
}

export default Header
