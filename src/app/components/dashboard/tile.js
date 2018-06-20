/* @flow */
import React, { Component } from 'react'
import { Flex } from 'ui'
import { Link } from 'react-router-dom'

import styles from './styles.scss'

export type Props = {
  icon: string,
  title: string,
  url: string,
  text: string,
  subText?: string,
}

export default class DashboardTile extends Component<Props> {
  static defaultProps = {
    subText: '',
  }

  render() {
    return (
      <Flex height='24vh' flexGrow={ 1 } flexBasis='100%' alignContent='center' alignItems='center' className={ styles.tile }>
        <Link to={ { pathname: this.props.url } }>
          <img
            src={ this.props.icon }
            alt={ this.props.title }
            className={ styles.icon }
          />
          <h6>{ this.props.title }</h6>
          <div style={ { position: 'relative' } }>
            <span className={ styles.featureStat }>{ this.props.text }</span>
            <span className={ styles.featureStatUnderline }>
              {
                this.props.subText
              }
            </span>
          </div>
        </Link>
      </Flex>
    )
  }
}
