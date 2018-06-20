/* @flow */
import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import { Flex, DropdownSingle, type DropdownOptions as Options } from 'ui'
import classnames from 'classnames'
import { sortBy } from 'lodash/fp'

import type {
  Job,
} from 'tandem'

import styles from './styles.scss'

type Props = {
  role: string,
  match: Function,
  skip: Function,
  skipAll: Function,
  suggestions: ?Array<Job>,
  jobList: Array<Job>,
  updateProgress: Function,
  total: number,
  notMatched: Array<string>,
}

type State = {
  dropdownValue: string,
  matched: boolean,
  skipped: boolean,
}

class JobMatchingCard extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      dropdownValue: '',
      matched: false,
      skipped: false,
    }
  }

  generateOptionsList(): Options {
    let options = []
    const { suggestions } = this.props

    this.props.jobList.forEach(job => {
      if (suggestions) {
        if (!suggestions.find(jobObj => jobObj.name.toLowerCase() === job.name.toLowerCase())) {
          options.push({ value: job.code, label: job.name })
        }
      } else {
        options.push({ value: job.code, label: job.name })
      }
    })

    options = sortBy('label')(options)

    if (suggestions) {
      suggestions.sort().reverse().forEach(job => {
        options.unshift({
          value: job.code,
          label: job.name,
          className: styles.highlightedOptions,
        })
      })
    }

    return options
  }

  render() {
    const { length: count } = this.props.notMatched.filter(i => i === this.props.role)

    // eslint-disable-next-line css-modules/no-undef-class
    const debounce = parseInt(styles.slidingSpeed, 10)
    const animateOut = this.state.matched || this.state.skipped
    return (
      <Flex alignItems='flex-start' justifyContent='center' className={ classnames(styles.JobMatchingCard, animateOut ? styles.animateOut : '') }>
        <div key={ this.props.role }>
          <p>
            <strong>{ this.props.role }</strong>{` (${ count } records) `}<br />
            We could not find an exact match for this record.
          </p>
          <DropdownSingle
            value={ this.state.dropdownValue }
            clearable={ false }
            label='All available job titles (suggestions are highlighted)'
            options={ this.generateOptionsList() }
            placeholder='Select one from the list'
            onChange={ option => {
              this.setState({ dropdownValue: option.value }, () => {
                setTimeout(() => {
                  this.setState({ matched: true }, () => {
                    setTimeout(() => {
                      this.props.match(this.props.role, option)
                      this.props.updateProgress(
                        this.props.total,
                        this.props.notMatched.length - 1,
                      )
                    }, debounce)
                  })
                }, 500) // allow user to see what was selected for 500ms
              })
            } }
          />

          <p>
            {`If you can't find a match you can always skip this job type (${ count } records will be excluded from the reports)`}
          </p>
          <Button
            disabled={ this.state.dropdownValue }
            onClick={ () => {
              this.setState({ skipped: true }, () => {
                setTimeout(() => {
                  this.props.updateProgress(this.props.total, this.props.notMatched.length - 1)
                  this.props.skip(this.props.role)
                }, debounce)
              })
            } }
          >Skip
          </Button>

          <Button
            style={ { float: 'right' } }
            disabled={ this.state.dropdownValue }
            onClick={ () => {
              this.setState({ skipped: true }, () => {
                setTimeout(() => {
                  this.props.updateProgress(this.props.total, this.props.notMatched.length - 1)
                  this.props.skipAll()
                }, debounce)
              })
            } }
          >Skip All
          </Button>
        </div>
      </Flex>
    )
  }
}

export default JobMatchingCard
