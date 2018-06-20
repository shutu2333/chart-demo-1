/* @flow */

import React, { Component, type Element } from 'react'
import { Flex, Button, Input } from 'ui'
import { employeeKeys } from 'tandem/aggs'
import {
  flow,
  reduce,
  thru,
  filter,
  map,
  keys,
  sortBy,
  orderBy,
  reverse,
} from 'lodash/fp'

import { Menu, MenuItem } from '@blueprintjs/core'

import classnames from 'classnames'

import type {
  Dataset,
  Job,
  JobDistance,
  JobElement,
} from 'tandem'

import Legend from '../Legend'
import Header from '../../layout/Header'

import reportStyles from '../styles.scss'
import styles from './styles.scss'


import Chart, { type ChartElement } from './chart'

type ListOption = {
  value: string,
  name: string,
  label: string | Element<*>,
  p: number,
  className: string,
}

type ListOptions = Array<ListOption>

type State = {

  from?: ListOption | string,
  to?: ListOption | string,

  fromList: Array<Job>,

  toList?: {
    ours: JobDistance,
    all: JobDistance,
  },

  onlyCompanyJobs: boolean,
  fromListSearch: string,
  toListSearch: string,
  currentType: string,

  elementGroups?: Array<ChartElement>,
  elementsListResponse?: Array<ChartElement>,
}

type Props = {
  dataset: Dataset,

  jobList: ?Array<Job>,
  GetJobList: () => Promise<Array<Job>>,
  GetDistances: (string) => Promise<Array<JobDistance>>,
  GetElements: (...jobs: Array<string>) => Promise<Array<JobElement>>,

}

type ElementGroup = {
  [string]: JobElement,
}

// const typesOrder = {
//   'skills': 1,
//   'knowledge': 2,
//   'abilities': 3,
//   'activities': 4,
//   'context': 5,
// }

const typeNames = {
  'skills': 'Skills',
  'knowledge': 'Knowledge',
  'abilities': 'Abilities',
  'activities': 'Work Activities',
  'context': 'Work Context',
}

// string is a valid node!
const typeValues: Array<string> = (Object.values(typeNames): any)

// export const colors = {
//   'skills': reportStyles.primaryColor, // eslint-disable-line css-modules/no-undef-class
//   'knowledge': reportStyles.lightOrange, // eslint-disable-line css-modules/no-undef-class
//   'abilities': reportStyles.lightGray2, // eslint-disable-line css-modules/no-undef-class
//   'activities': reportStyles.lighterGray, // eslint-disable-line css-modules/no-undef-class
//   'context': reportStyles.lightGray2_1, // eslint-disable-line css-modules/no-undef-class
// }

const legendContent = {
  'Skills': {
    content: 'Skills are developed capacities that facilitate learning and the performance of activities that occur across jobs.',
  },
  'Knowledge': {
    content: 'Knowledges are organized sets of principles and facts that apply to a wide range of situations.',
  },
  'Abilities': {
    content: 'Abilities are enduring attributes of an individual that influence performance.',
  },
  'Work Activities': {
    content: 'Work Activities summarize the kinds of tasks that may be performed across multiple occupations.',
  },
  'Work Context': {
    content: 'Work Context refers to physical and social factors that influence the nature of work.',
  },
}

function filterElements(
  source: string,
  target: string,
  elements: Array<JobElement>,
  currentType: string,
) {
  return flow(
    reduce((es, e) => {
      es[e.soc] = es[e.soc] || {}
      es[e.soc][e.code] = e
      return es
    }, {}),
    thru(es => {
      const sourceElements: ElementGroup = es[source]
      const targetElements: ElementGroup = es[target]

      return flow(
        keys,
        map(code => {
          const s = sourceElements[code]
          const t = targetElements[code]

          if (!t) {
            return {
              code,
              value: -1,


              // these attributes are required to give a consistent view of the `flow`
              // chain for flowtype.
              type: 'context', // no special meaning, but it must exist in typeNames.
              y: 0,
              y0: 0,
              x: '',
            }
          }

          const delta = t.value - s.value

          return {
            code,
            type: s.type,
            x: s.name = s.name.length > 60 ? `${ s.name.substring(0, 60) }...` : s.name.substring(0, 60),
            value: delta,
            y0: s.value,
            y: s.value + delta,
          }
        }),
        filter(e => e.value >= 0.1),
        filter(e => typeNames[e.type] === currentType),
        orderBy(['y'], ['asc']),
      )(sourceElements)
    }),
  )(elements)
}

const itemsInTopList = 10

export default class JobCorridor extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      from: '',
      to: '',
      onlyCompanyJobs: true,
      fromListSearch: '',
      fromList: [],
      toListSearch: '',
      currentType: 'Skills',
    }
  }

  componentDidMount() {
    this.props.GetJobList().then(() => {
      this.setState({
        fromList: reverse(sortBy('p')(this.filterCompanyJobs(this.props.jobList, 'code'))),
      }, () => {
        this.fromSelected(this.fromListOptions()[0], true)
      })
    })
  }

  isSelected(target: string, code: string) {
    if (this.state[target] && this.state[target].value === code) {
      return true
    }
    return false
  }

  generateLabel(name: string, impact: any) {
    return (
      <Flex justifyContent='space-between'>
        <div className={ styles.optionName }>{ name }</div>
        <div className={ styles.impactValue }>
          { impact ? impact.toFixed(2) : '?' }
        </div>
      </Flex>
    )
  }

  fromListOptions(): ListOptions {
    return this.state.fromList.reduce((options, job, i) => {
      if (i < itemsInTopList) {
        options.push({
          value: job.code,
          name: job.name,
          label: this.generateLabel(job.name, job.p),
          p: job.p,
          className: classnames(styles.highlightedOptions, this.isSelected('from', job.code) ? styles.selected : ''),
        })
      } else {
        options.push({
          value: job.code,
          name: job.name,
          label: this.generateLabel(job.name, job.p),
          p: job.p,
          className: classnames(this.isSelected('from', job.code) ? styles.selected : ''),
        })
      }
      return options
    }, [])
  }

  toListOptions(ours: boolean = false): ListOptions {
    const target = ours ? 'ours' : 'all'
    const toList = (this.state.toList: any)
    const jobList = (this.props.jobList: any)

    return toList[target].reduce((options, job) => {
      const J = jobList.find(j => j.code === job.from)

      if (!J) {
        return options
      }

      const { name, p, code } = J

      if (toList.ours.find(j => j.from === job.from)) {
        options.push({
          value: job.from,
          p,
          name,
          label: this.generateLabel(name, p),
          distance: job.distance,
          className: classnames(styles.highlightedOptions, this.isSelected('to', code) ? styles.selected : ''),
        })
      } else {
        options.push({
          value: job.from,
          p,
          name,
          label: this.generateLabel(name, p),
          distance: job.distance,
          className: classnames(this.isSelected('to', code) ? styles.selected : ''),
        })
      }

      return options
    }, [])
      .sort((a, b) => a.distance - b.distance)
  }

  // $FlowFixMe: Why the fuck is this generalized over Job and Job Distance?
  filterCompanyJobs(list: Array<Job> | Array<JobDistance>, codeField: string) {
    return this.props.dataset.employeeData.reduce((jobs, job) => {
      const alreadyAdded = jobs.find(j => j[codeField] === job[employeeKeys.SOCCode])
      if (!alreadyAdded) {
        const match = list.find(j => j[codeField] === job[employeeKeys.SOCCode])
        if (match) {
          jobs.push(match)
        }
      }
      return jobs
    }, [])
  }

  fromSelected(option: ListOption, selectFirst: boolean = false) {
    this.setState({
      to: '',
      elementGroups: undefined,
      from: option,
      currentType: 'Skills',
    }, () => {
      const from = (this.state.from: any)
      this.props.GetDistances(from.value).then(resp => {
        const toList = {
          all: resp,
          ours: sortBy(['distance'])(this.filterCompanyJobs(resp, 'from')),
        }
        // $FlowFixMe: this thing needs refactoring proper.
        this.setState({ toList }, () => {
          if (selectFirst) {
            this.toSelected(this.toListOptions(this.state.onlyCompanyJobs)[0])
          }
        })
      })
    })
  }

  toSelected(option: ListOption) {
    this.setState({ to: option }, () => {
      const from = this.state.from
      const to = this.state.to

      if (typeof from !== 'object' || typeof to !== 'object') return

      const fromSoc : string = from.value
      const toSoc: string = to.value

      this.props.GetElements(fromSoc, toSoc).then(elementsListResponse => {
        this.generateJobElements(elementsListResponse)
      })
    })
  }

  generateJobElements(elementsListResponse: any) {
    if (elementsListResponse) {
      const from = this.state.from
      const to = this.state.to

      if (typeof from !== 'object' || typeof to !== 'object') return

      const fromSoc : string = from.value
      const toSoc: string = to.value

      const elementGroups = filterElements(
        fromSoc,
        toSoc,
        elementsListResponse,
        this.state.currentType,
      )
      this.setState({ elementGroups, elementsListResponse })
    }
  }

  toggleOnlyCompanyJobs(value: boolean) {
    this.setState({
      onlyCompanyJobs: value,
      to: '',
      elementGroups: undefined,
    })
  }

  render() {
    if (!this.props.jobList) return null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title='Job Corridor'
          description='Find the path of additional skills to travel from one job to another. The chart below shows the gap (represented as an arrow) between the importance of each job-attribute in the current role (source) and the future role (target)'
        />

        <div>

          <div
            className={ classnames(styles.onlyCompanyJobsButton, reportStyles.switchButton) } // eslint-disable-line max-len
          >
            <Button
              className={ !this.state.onlyCompanyJobs ? 'not-selected' : '' }
              onClick={ () => { this.toggleOnlyCompanyJobs(true) } }
            >Internal
            </Button>
            <Button
              className={ this.state.onlyCompanyJobs ? 'not-selected' : '' }
              onClick={ () => { this.toggleOnlyCompanyJobs(false) } }
            >All
            </Button>
          </div>

          <Flex flexDirection='row' justifyContent='space-between'>
            <div className={ styles.listPanel }>

              <span>Select a source (top { itemsInTopList } highlighted) <span style={ { float: 'right' } }>Risk</span></span>
              <Input
                className={ styles.searchInput }
                placeholder='Search..'
                value={ this.state.fromListSearch }
                onChange={ (event) => this.setState({ fromListSearch: event.target.value }) }
              />

              <Menu className={ styles.list }>
                {
                  this.fromListOptions().filter((o: ListOption) =>
                  o.name.toLowerCase()
                  .includes(this.state.fromListSearch.toLowerCase())).map(o =>
                    (
                      <MenuItem
                        key={ o.value }
                        onClick={ () => this.fromSelected(o) }
                        text={ o.label }
                        className={ o.className }
                      />
                    ))
                }
              </Menu>
              <h4>{ typeof this.state.from === 'object' ? this.state.from.name : '' }</h4>
            </div>

            <div className={ styles.listPanel }>
              { this.state.toList ?
                <div>
                  <span>Select a target (internal jobs highlighted) <span style={ { float: 'right' } }>Risk</span></span>
                  <Input
                    className={ styles.searchInput }
                    placeholder='Search..'
                    value={ this.state.toListSearch }
                    onChange={ (event) => this.setState({ toListSearch: event.target.value }) }
                  />

                  <Menu className={ styles.list }>
                    {
                      this.toListOptions(this.state.onlyCompanyJobs)
                      .filter(option => option.name.toLowerCase()
                      .includes(this.state.toListSearch.toLowerCase()))
                      .map(option =>
                      (
                        <MenuItem
                          key={ option.value }
                          onClick={ () => this.toSelected(option) }
                          text={ option.label }
                          className={ option.className }
                        />
                      ))
                    }
                  </Menu>

                  <h4 style={ { textAlign: 'right' } }>{ typeof this.state.to === 'object' ? this.state.to.name : '' }</h4>
                </div>
                : ''
              }
            </div>

          </Flex>

          <Legend
            displayColours={ false }
            className={ styles.legendClass }
            headers={ typeValues }
            legendContent={ legendContent }
            selectedTabId={ this.state.currentType }
            changeCurrentType={ (currentType: string) => {
              this.setState({ currentType }, () => {
                this.generateJobElements(this.state.elementsListResponse)
              })
            } }
          />

          {
            this.state.elementGroups
              ? <Chart elements={ this.state.elementGroups } />
              : null
          }

          <div>
            <p>
              {'*Risk is the probability of automation/augmentation at year 15'}
            </p>
          </div>


        </div>
      </Flex>
    )
  }
}
