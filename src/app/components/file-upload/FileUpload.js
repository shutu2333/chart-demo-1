/* @flow */
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Collapse } from '@blueprintjs/core'
import { Flex } from 'ui'
import classnames from 'classnames'
import Papa from 'papaparse'

import {
  membershipTypes,
  type Organization,
  type Job,
} from 'tandem'

import StepButton from './StepButton'
import Header from '../layout/Header'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { type DatasetInput } from '../../factors/datasets'
import config from './papaparse-config'
import matchJobs from './matchJobs'

import styles from './styles.scss'

export type invalidJobsType = {
  socCodes: Object,
  roleNames: Object,
  unknown: number
}

type State = {
  visiblePanel: number,
  csv: File | null,
  datasetInput: ?DatasetInput,
  invalidJobs?: invalidJobsType,
  notMatched: Array<string>,
  matched: Array<string>,
  skipped: Array<string>,
  suggestions?: any,
  initalRecordsCount?: number,
  startOverDialog: {
    open: boolean,
    confirmed: boolean,
  },
}

export type Props = {
  organization: Organization,

  jobList: ?Array<Job>,

  GetJobList: () => Promise<Array<Job>>,

  UpdateErrorMessage: (?string) => *,
  AddNewDataset: (region: string, DatasetInput) => Promise<*>,
}

const localStorageKeyValidation = 'validationProcess'

const defaultState: State = {
  visiblePanel: 1,
  csv: null,
  datasetInput: null,
  matched: [],
  skipped: [],
  notMatched: [],
  suggestions: null,
  startOverDialog: {
    open: false,
    confirmed: false,
  },
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

class FileUpload extends Component<Props, State> {
  constructor() {
    super()
    this.state = defaultState
  }

  componentWillMount() {
    const savedState: any = this.getSavedState()
    if (savedState) {
      this.continueFromSavedState(this.props, savedState)
    }
  }

  componentDidMount() {
    if (!this.props.jobList) this.props.GetJobList()
  }

  onUserAction(datasetInput: DatasetInput, matched: Array<string>, skipped: Array<string>,
    notMatched: Array<string>, invalidJobs: invalidJobsType, goToStep3: boolean = false) {
    if (goToStep3) {
      // matching complete, move on
      const state = {
        ...this.state,
        visiblePanel: 3,
        datasetInput,
        matched,
        skipped,
        notMatched,
        invalidJobs,
      }
      this.uploadData(state)
    } else {
      // continue matching
      const state = {
        ...this.state,
        datasetInput,
        matched,
        skipped,
        notMatched,
        invalidJobs,
      }

      this.saveState(state)
      this.setState(state)
    }
  }

  setActiveClass(i: number) {
    return this.state.visiblePanel === i ? 'active' : ''
  }

  getTotalInvalids() {
    return Object.entries(this.state.invalidJobs)
      .reduce((total, [type, invalids]) => {
        if (type === 'unknown') {
          total.records += (invalids: any)
          return total
        }

        total.jobTitles += Object.keys((invalids: any)).reduce((t) => {
          return t + 1
        }, 0)
        total.records += Object.values(invalids).reduce((t, n) => {
          return t + (n: any)
        }, 0)

        return total
      }, { jobTitles: 0, records: 0 })
  }

  getValidationPercentage() {
    const initalRecordsCount: any = this.state.initalRecordsCount
    const notMatched: any = this.state.notMatched
    const validated = initalRecordsCount - this.getTotalInvalids().records - notMatched.length
    return ((validated / initalRecordsCount) * 100)
  }

  getSavedState() {
    const savedState: any = localStorage.getItem(localStorageKeyValidation)
    if (savedState) {
      return JSON.parse(savedState)
    }
    return false
  }

  saveState(state: State, forceSave: boolean = false) {
    if (forceSave) {
      localStorage.setItem(localStorageKeyValidation, JSON.stringify(state))
    } else {
      const { organization: currentOrganization } = this.props
      const orgId = currentOrganization ? currentOrganization.id : ''
      let savedState = this.getSavedState()
      if (savedState) {
        savedState = { ...savedState, [orgId]: state }
      } else {
        savedState = { [orgId]: state }
      }
      localStorage.setItem(localStorageKeyValidation, JSON.stringify(savedState))
    }
  }

  continueFromSavedState(props: Props, savedState: State) {
    const { organization: currentOrganization } = props
    if (currentOrganization) {
      const storedOrgIds = Object.keys(savedState)
      if (storedOrgIds.includes(currentOrganization.id)) {
        this.setState({ ...savedState[currentOrganization.id] })
      } else {
        this.setState(defaultState)
      }
    }
  }

  startOver() {
    const savedState = this.getSavedState()
    if (savedState) {
      if (this.props.organization) {
        delete savedState[this.props.organization.id]
      }
      this.saveState(savedState, true)
    }
    this.setState(defaultState)
  }

  parseFile(csv: File) {
    const { organization: currentOrganization } = this.props
    const orgName = currentOrganization ? currentOrganization.name : ''
    const orgId = currentOrganization ? currentOrganization.id : ''

    const datasetInput = {
      name: orgName,
      organizationId: orgId,
      employeeData: [],
    }

    Papa.parse(csv, {
      ...config,
      error: (error: any, file: File) => {
        this.props.UpdateErrorMessage(`Error reading file ${ file.name }: ${ error }`)
      },

      step: ({ data }) => {
        const row = data[0]
        if (!row.length || row[0] === 'id') return

        datasetInput.employeeData.push(
          row.map(value => (value === '' ? null : value)),
        )
      },

      complete: () => this.matchJobs(datasetInput),
    })
  }


  matchJobs(datasetInput: DatasetInput) {
    const initalRecordsCount = datasetInput.employeeData.length

    if (!this.props.jobList) throw new Error('should not call matchJobs before loading jobs')
    const { valid, invalid, notMatched } = matchJobs(datasetInput, this.props.jobList)

    datasetInput.employeeData = valid

    if (notMatched.length) {
      const suggestions = {}
      // TODO: Use alts to find suggestions.
      this.goToMatching(datasetInput, invalid, notMatched, suggestions, initalRecordsCount)
    } else {
      const state = {
        ...this.state,
        datasetInput,
        visiblePanel: 3,
        invalidJobs: invalid,
        notMatched,
        initalRecordsCount,
      }
      this.uploadData(state)
    }
  }

  goToMatching(datasetInput: DatasetInput, invalidJobs: invalidJobsType,
    notMatched: Array<string>, suggestions: Object, initalRecordsCount: number) {
    this.setState({
      datasetInput,
      visiblePanel: 2,
      invalidJobs,
      notMatched,
      suggestions,
      initalRecordsCount,
    })
  }

  uploadData(state: State) {
    localStorage.removeItem(localStorageKeyValidation)
    if (!state.datasetInput) return // error?
    this.props.AddNewDataset(
      // this is a mess.
      (this.props.organization || {}).region,
      state.datasetInput,
    ).then(() => {
      this.setState(state)
    })
  }


  openPanel(i: number) {
    this.setState({ visiblePanel: i })
  }

  render() {
    if (!this.props.organization) return null // should be even here. Throw error?
    if (!this.props.jobList) return null // componentDidMount will request them.

    const { name: orgName, slug: orgSlug, membershipType } = this.props.organization

    if (!membershipType || membershipType < membershipTypes.admin) {
      return <Redirect to={ `/${ orgSlug }/` } />
    }

    return (
      <Flex flexDirection='column'>
        <Header title={ `Upload Company Data for ${ orgName }` } />

        <div>
          <StepButton
            step={ 1 }
            visiblePanel={ this.state.visiblePanel }
            setActiveClass={ (i) => this.setActiveClass(i) }
            openPanel={ (i) => this.openPanel(i) }
            heading='Upload Data'
          />

          <Collapse
            className={ classnames(styles.stepArea, this.setActiveClass(1)) }
            isOpen={ this.state.visiblePanel === 1 }
            transitionDuration={ 200 }
          >
            <Step1
              onLoad={ (csv) => this.parseFile(csv) }
              UpdateErrorMessage={ this.props.UpdateErrorMessage }
            />
          </Collapse>
        </div>

        <div>
          <StepButton
            className={ styles.section }
            step={ 2 }
            visiblePanel={ this.state.visiblePanel }
            setActiveClass={ (i) => this.setActiveClass(i) }
            openPanel={ (i) => this.openPanel(i) }
            heading={
              this.state.visiblePanel === 2 ?
                `Validate Data (${ this.getValidationPercentage().toFixed(0) }% of records match)`
              : 'Validate Data'
            }
          />

          <Collapse
            className={ classnames(styles.stepArea, this.setActiveClass(2)) }
            isOpen={ this.state.visiblePanel === 2 }
            transitionDuration={ 200 }
          >
            { this.props.jobList && this.state.datasetInput && this.state.invalidJobs /* wot? */ ?
              <div>
                <Step2
                  datasetInput={ this.state.datasetInput }
                  invalidJobs={ this.state.invalidJobs }
                  notMatched={ this.state.notMatched }
                  // eslint-disable-next-line max-len
                  onUserAction={
                    (datasetInput, matched, skipped, notMatched, invalidJobs, goToStep3) => {
                      this.onUserAction(
                        datasetInput,
                        matched,
                        skipped,
                        notMatched,
                        invalidJobs,
                        goToStep3,
                      )
                    }
                  }
                  jobList={ this.props.jobList }
                  skipped={ this.state.skipped }
                  matched={ this.state.matched }
                  suggestions={ this.state.suggestions }
                  totalInvalids={ this.getTotalInvalids() }
                  totalNotMatched={ this.state.notMatched.filter(onlyUnique).length }
                  StartOverDialogOpen={ this.state.startOverDialog.open }
                  startOverInit={ () => this.setState({
                    startOverDialog: { open: true, confirmed: false },
                  }) }
                  startOverCancel={ () => this.setState({
                    startOverDialog: { open: false, confirmed: false },
                  }) }
                  startOverConfirm={ () => this.setState({
                    startOverDialog: { open: false, confirmed: true },
                  },
                    () => this.startOver())
                  }
                />
              </div>
              : ''
            }
          </Collapse>
        </div>

        <div>
          <StepButton
            step={ 3 }
            visiblePanel={ this.state.visiblePanel }
            setActiveClass={ (i) => this.setActiveClass(i) }
            openPanel={ (i) => this.openPanel(i) }
            heading='View Data Results'
          />

          <Collapse
            className={ classnames(styles.stepArea, this.setActiveClass(3)) }
            isOpen={ this.state.visiblePanel === 3 }
            transitionDuration={ 200 }
          >
            { this.state.datasetInput ?
              <Step3 organizationSlug={ orgSlug } />
              : ''
            }
          </Collapse>
        </div>

      </Flex>
    )
  }
}

export default FileUpload
