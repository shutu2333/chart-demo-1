/* @flow */
import React, { Component } from 'react'
import { Flex } from 'ui'
import Ionicon from 'react-ionicons'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import Header from '../layout/Header'

import styles from './styles.scss'

const reports = [
  {
    id: 1,
    status: 'completed',
    user: 'Greg Miller',
    date: '21 Aug 2017',
  },
  {
    id: 2,
    status: 'completed',
    user: 'Richard George',
    date: '19 Jul 2017',
  },
  {
    id: 3,
    status: 'processing',
    user: 'Richard George',
    date: '16 May 2017',
  },
]

class History extends Component<{}> {
  render() {
    return (
      <Flex flexDirection='column'>
        <Header title='History' />

        <Flex flexDirection='row' alignItems='center' className={ classnames(styles.table) }>
          <h5>Status</h5>
          <h5>User</h5>
          <h5>Date</h5>
          <h5>Action</h5>
        </Flex>
        {
          reports.map(({ id, status, user, date }) => {
            return (
              <Flex key={ id } flexDirection='row' alignItems='center' className={ styles.table }>
                <div>
                  <Ionicon
                    icon={ status === 'completed' ? 'ion-ios-checkmark-empty' : 'ion-ios-minus-empty' }
                    fontSize='38px'
                    color={ styles.white } // eslint-disable-line css-modules/no-undef-class
                  />
                </div>
                <div>{ user }</div>
                <div>{ date }</div>
                <div className={ styles.action }>
                  {
                    status === 'completed' &&
                    <Link to='/'>
                      View report
                      <Ionicon
                        className={ classnames(styles.viewReportIcon) }
                        icon='ion-ios-arrow-right'
                        fontSize='25px'
                        // eslint-disable-next-line css-modules/no-undef-class
                        color={ styles.lighterGray }
                      />
                    </Link>
                  }
                  {
                    status === 'processing' &&
                    <span className={ styles.processing }>Processing</span>
                  }
                </div>
              </Flex>
            )
          })
        }
      </Flex>
    )
  }
}

export default History
