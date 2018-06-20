/* @flow */
import React, { Component } from 'react'
import { Tab, Tabs } from '@blueprintjs/core'
import { Flex } from 'ui'
import classnames from 'classnames'

import styles from './styles.scss'

type Props = {
  headers: Array<string>,
  legendContent: Object,
  changeCurrentType?: Function,
  className?: any,
  displayColours: boolean,
  selectedTabId?: string,
}

class Legend extends Component<Props> {
  static defaultProps = {
    techs: [],
    changeCurrentType: () => null,
    className: '',
    displayColours: true,
  }

  render() {
    return (
      <Flex flexDirection='column' className={ classnames(styles.tabs, this.props.className) }>
        <Tabs
          id='legend-tabs'
          animate={ false }
          selectedTabId={ this.props.selectedTabId }
          onChange={ (newTab) => {
            if (this.props.changeCurrentType) {
              this.props.changeCurrentType(newTab)
            }
          } }
        >
          {
            this.props.headers.map(header => {
              return (
                <Tab
                  key={
                    /*
                     * XXX(ome): Find out what header exactly is, use a proper
                     * value based key instead of index which could shift.
                     */
                    `legend-header-${ header }`
                  }
                  id={ header }
                  title={ (
                    <div>
                      { this.props.displayColours ?
                        <span
                          className={ styles.legend }
                          style={ { background: this.props.legendContent[header].color } }
                        /> : ''
                      }
                      <span>{ header }</span>
                    </div>
                  ) }
                  panel={ (
                    <div className={ styles.panel }>
                      { this.props.legendContent[header].content }
                    </div>
                  ) }
                />
              )
            })
          }
        </Tabs>
      </Flex>
    )
  }
}

export default Legend
