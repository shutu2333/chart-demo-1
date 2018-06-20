/* @flow */
import React, { Component } from 'react'
import { Link, withRouter, type Match } from 'react-router-dom'
import Ionicon from 'react-ionicons'
import classnames from 'classnames'

import styles from './styles.scss'

import { reportsTitle, reportRoute } from './reports-names'

type Props = {
  currentReport: string,
  match: Match,
}

class navigation extends Component<Props> {
  getNextPrev() {
    const { organizationSlug: slug } = this.props.match.params
    const dashboard = {
      url: `/${ slug }`,
      title: 'Dashboard',
    }

    const titles: Array<string> = (Object.values(reportsTitle): any)

    const index = titles.indexOf(this.props.currentReport)
    const prevIndex = index - 1
    const nextIndex = index + 1

    const prev = prevIndex > -1
      ? {
        url: reportRoute(slug, titles[prevIndex]),
        title: titles[prevIndex],
      }
      : dashboard

    const next = nextIndex < titles.length
      ? {
        url: reportRoute(slug, titles[nextIndex]),
        title: titles[nextIndex],
      }
      : dashboard

    return { prev, next }
  }

  render() {
    return (
      <div>
        {
          Object.entries(this.getNextPrev()).map(entry => {
            const nav: string = entry[0]
            const report: any = entry[1]
            let linkStyles = styles.prev
            if (nav === 'next') {
              linkStyles = styles.next
            }
            return (
              <Link
                key={ report.url }
                to={ report.url }
                className={ classnames(linkStyles, styles.navButton) }
              >
                <div className={ styles.navIcon }>
                  <Ionicon
                    icon={ nav === 'next' ? 'ion-ios-arrow-right' : 'ion-ios-arrow-left' }
                    fontSize='30px'
                    color={ styles.lighterGray } // eslint-disable-line css-modules/no-undef-class
                  />
                </div>
                { report.title }
              </Link>
            )
          })
        }
      </div>
    )
  }
}

export default withRouter(navigation)
