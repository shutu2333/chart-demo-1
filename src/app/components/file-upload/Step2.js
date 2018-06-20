/* @flow */
import React, { Component } from 'react'
import { ProgressBar } from '@blueprintjs/core'
import { type DropdownOption as Option, Button, Flex } from 'ui'

import type {
  Job,
} from 'tandem'

import { employeeKeys } from 'tandem/aggs/input'

import { type DatasetInput } from '../../factors/datasets'
import { type invalidJobsType } from './FileUpload'
import JobMatchingCard from './JobMatchingCard'
import StartOver from './StartOver'

import styles from './styles.scss'

type Props = {
  datasetInput: DatasetInput,
  invalidJobs: invalidJobsType,
  notMatched: Array<string>,
  totalNotMatched: number,
  jobList: Array<Job>,
  matched: Array<string>,
  skipped: Array<string>,
  onUserAction: Function,
  suggestions?: ?Object,
  StartOverDialogOpen: boolean,
  startOverInit: Function,
  startOverCancel: Function,
  startOverConfirm: Function,
}

type State = {
  progress: number,
}

class Step2 extends Component<Props, State> {
  static defaultProps = {
    suggestions: null,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      progress: this.getProgress(this.props.datasetInput.employeeData.length,
        this.props.notMatched.length),
    }
  }

  getProgress(total: number, notMatched: number) {
    return parseFloat(((total - notMatched) / total).toFixed(2))
  }

  updateProgress(total: number, notMatched: number) {
    this.setState({
      progress: this.getProgress(total, notMatched),
    })
  }

  match(roleName: string, option: Option) {
    const matched = [...this.props.matched, roleName]

    const employeeData = this.props.datasetInput.employeeData.map((job: any) => {
      if (job[employeeKeys.roleName] === roleName) {
        job[employeeKeys.SOCCode] = option.value
        job[employeeKeys.SOCName] = option.label
      }
      return job
    })

    const datasetInput = { ...this.props.datasetInput, employeeData }
    const notMatched = this.props.notMatched.filter((item) => { return item !== roleName })

    this.props.onUserAction(datasetInput, matched, this.props.skipped,
      notMatched, this.props.invalidJobs)
  }

  skipAll() {
    this.props.notMatched.forEach(role => this.skip(role))
  }

  skip(role: string) {
    const filteredEmployeeData = this.props.datasetInput.employeeData.filter((job: any) => {
      const roleName = job[employeeKeys.roleName]
      return roleName !== role
    })

    const skipped = [...this.props.skipped, role]
    const recordsRemoved = this.props.datasetInput.employeeData.length - filteredEmployeeData.length
    const roleName = this.props.invalidJobs.roleNames[role]

    const invalidJobs = {
      ...this.props.invalidJobs,
      roleNames: {
        ...this.props.invalidJobs.roleNames,
        [role]: roleName ? (roleName + recordsRemoved) : recordsRemoved,
      },
    }

    const datasetInput = { ...this.props.datasetInput, employeeData: filteredEmployeeData }
    const notMatched = this.props.notMatched.filter((item) => item !== role)

    this.props.onUserAction(datasetInput, this.props.matched, skipped, notMatched, invalidJobs)
  }

  continue() {
    this.props.onUserAction(this.props.datasetInput, this.props.matched, this.props.skipped,
      this.props.notMatched, this.props.invalidJobs, true)
  }

  render() {
    const invalids = this.props.invalidJobs
      ? { ...this.props.invalidJobs.socCodes, ...this.props.invalidJobs.roleNames }
      : {}

    return (
      <div>
        <p>
          { this.props.totalNotMatched } job titles ({ this.props.notMatched.length } records)
          can not be matched on the Tandem platform.<br />
          The data validation process will allow you to either match the individual job title
          or skip them from the data modelling process.
        </p>

        <ProgressBar value={ this.state.progress } className={ styles.progressBar } />
        {
          this.props.notMatched.map((role, index) => {
            return index === 0 ?
              <JobMatchingCard
                key={ role }
                role={ role }
                suggestions={ this.props.suggestions ? this.props.suggestions[role] : null }
                match={ (roleName, option) => this.match(roleName, option) }
                skip={ (value) => this.skip(value) }
                skipAll={ () => this.skipAll() }
                total={ this.props.datasetInput.employeeData.length }
                notMatched={ this.props.notMatched }
                updateProgress={ (total, notMatched) => this.updateProgress(total, notMatched) }
                jobList={ this.props.jobList }
              /> : ''
          })
        }

        {
          !this.props.notMatched.length && Object.entries(invalids).length
            ? (
              <div style={ { marginBottom: '20px' } }>
                <h2>Records excluded from the data model</h2>
                <div>
                  {
                    Object.entries(invalids).sort().reverse().map(([code, key]) => {
                      return (
                        <div key={ code }>
                          { `${ (key: any) } jobs found with invalid code ${ code }` }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
            : null
        }

        <div>
          <Flex justifyContent='space-between'>
            { !this.props.notMatched.length
                ? (
                  <Button
                    className={ styles.completeValidation }
                    onClick={ () => this.continue() }
                  >
                    Complete validation
                  </Button>
                )
                : null
            }
            <div />
            <StartOver
              isOpen={ this.props.StartOverDialogOpen }
              startOverInit={ this.props.startOverInit }
              startOverCancel={ this.props.startOverCancel }
              startOverConfirm={ this.props.startOverConfirm }
            />
          </Flex>
        </div>
      </div>
    )
  }
}

export default Step2
