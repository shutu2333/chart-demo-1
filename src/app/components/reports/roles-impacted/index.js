/* @flow */

import React, { Component, type Element } from 'react'
import {
  Flex,
  Button,
  Slider,
  Dropdown,
  type DropdownOptions as Options,
} from 'ui'


import { intword as HumanNumber } from 'humanize-plus'

import classnames from 'classnames'

import {
  flow,
  entries,
  map,
  range,
  sortBy,
  sortedUniq,
  compact,
  takeRight,
  filter,
  reduce,
} from 'lodash/fp'

import {
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryAxis,
  VictoryContainer,
} from 'victory'

import { type Dataset } from 'tandem'

import { rolesImpact, employeeKeys, findAgeRange } from 'tandem/aggs'

import { keyTechFilterOptions } from '../keyTechMeta'


import { reportsTitle } from '../reports-names'

import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

import theme from '../theme'

import LabelTooltip from '../label'

import styles from '../styles.scss'

type Props = {
  dataset: Dataset,
}

type State = {

  percentageChart: boolean,

  filters: {
    businessUnit: Options,
    location: Options,
    techs: Options,
    age: Options,
    department: Options,
    employeeLevel: Options,
    year: number,
  },

  filterOptions: {
    businessUnit: Options,
    location: Options,
    techs: Options,
    age: Options,
    department: Options,
    employeeLevel: Options,
    year: Array<number>,
  },

}

type groupImpact = {
  count: number,
  sumTotallCompensation: number,
  compensationImpact: Array<number>,
  countImpact: Array<number>,
}

class Report extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)
    this.state = {
      percentageChart: false,

      filters: {
        businessUnit: [],
        techs: [],
        location: [],
        age: [],
        department: [],
        employeeLevel: [],
        year: 5,
      },

      filterOptions: {
        techs: keyTechFilterOptions,

        businessUnit: flow(
          map(e => e[employeeKeys.businessUnit]),
          sortBy(i => i),
          sortedUniq,
          compact,
          map(value => ({ value, label: value })),
        )(props.dataset.employeeData),

        location: flow(
          map(e => e[employeeKeys.state]),
          sortBy(i => i),
          sortedUniq,
          compact,
          map(value => ({ value, label: value })),
        )(props.dataset.employeeData),

        age: flow(
          map(e => e[employeeKeys.age]),
          sortBy(i => i),
          sortedUniq,
          compact,
          reduce((options, age) => {
            const rangeAge = findAgeRange(age)
            options.push(rangeAge)
            return options
          }, []),
          sortBy(i => i.label),
          sortedUniq,
        )(props.dataset.employeeData),

        department: flow(
          map(e => e[employeeKeys.department]),
          sortBy(i => i),
          sortedUniq,
          compact,
          map(value => ({ value, label: value })),
        )(props.dataset.employeeData),

        employeeLevel: flow(
          map(e => e[employeeKeys.employeeLevel]),
          sortBy(i => i),
          sortedUniq,
          compact,
          map(value => ({ value, label: value })),
        )(props.dataset.employeeData),

        year: range(1)(16),
      },
    }

    this.svgs = {
      top: { node: null },
      bottom: { node: null },
    }
  }

  svgs: {
    top: { node: ?Element<*> },
    bottom: { node: ?Element<*> },
  }

  render() {
    const year = this.state.filters.year

    const data = flow(
      rolesImpact(this.props.dataset.model, {
        businessUnit: this.state.filters.businessUnit,
        location: this.state.filters.location,
        age: this.state.filters.age,
        department: this.state.filters.department,
        employeeLevel: this.state.filters.employeeLevel,
        techs: this.state.filters.techs,
      }),
      entries, /* need it for both bars, so do it once. */
      map(v => {
        v[0] = v[0].length > 30 ? `${ v[0].substring(0, 30) }...` : v[0].substring(0, 30)
        return v
      }),
      filter(v => v[1].countImpact[year] > 1),
    )(this.props.dataset.employeeData)

    this.svgs.top.node = null
    this.svgs.bottom.node = null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title={ reportsTitle.rolesImpacted }
          description='Which roles in your organisation have the greatest risk of automation / augmentation?'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.rolesImpacted } />

        {
          data.length > 0
          ? null
          : <div>Not enough data.</div>
        }
        {
          data.length > 0
          ? (
            <div>
              {
                !this.state.percentageChart
                ? (
                  <div className={ classnames(styles.chartArea, styles.rolesAtRisk) }>
                    <VictoryChart
                      theme={ theme }
                      width={ 1000 }
                      height={ 600 }
                      padding={ { left: 260, bottom: 60, top: 20, right: 140 } }
                      containerComponent={
                        <VictoryContainer
                          events={ {
                            ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                          } }
                        />
                      }
                    >
                      <VictoryBar
                        horizontal
                        style={ {
                          data: {
                            // eslint-disable-next-line css-modules/no-undef-class
                            fill: styles.primaryColor,
                          },
                        } }
                        data={
                          flow(
                            map(org => {
                              const name: string = org[0]
                              const impact: groupImpact = (org[1]: any)
                              const impactYear = impact.countImpact[year]
                              const percentageImpact = (impactYear / impact.count) * 100
                              const impactCount = Math.ceil(impactYear)
                              return {
                                x: name,
                                y: impactCount,
                                header: '',
                                subhead: `FTE ${ impactCount }`,
                                value: `(${ percentageImpact.toFixed(2) }%)`,
                                label: '',
                              }
                            }),
                            sortBy(i => i.y),
                            takeRight(20),
                          )(data)
                        }
                        labelComponent={ (
                          <LabelTooltip horizontal={ false } dx={ -10 } />
                        ) }
                      />

                      <VictoryAxis
                        dependentAxis
                      />
                      <VictoryAxis
                        axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
                        label='No. FTE Impact'
                      />

                    </VictoryChart>
                  </div>
                )
                : (
                  <div className={ classnames(styles.chartArea, styles.rolesAtRisk) }>
                    <VictoryChart
                      theme={ theme }
                      width={ 1000 }
                      height={ 600 }
                      padding={ { left: 260, bottom: 60, top: 20, right: 140 } }
                      containerComponent={
                        <VictoryContainer
                          events={ {
                            ref: svg => {
                              if (!this.svgs.bottom.node) { this.svgs.bottom.node = svg }
                            },
                          } }
                        />
                      }
                    >

                      <VictoryBar
                        horizontal
                        sortKey='y'
                        style={ {
                          data: {
                            // eslint-disable-next-line css-modules/no-undef-class
                            fill: styles.primaryColor,
                          },
                        } }
                        data={
                          flow(
                            map(org => {
                              const name: string = org[0]
                              const impact: groupImpact = (org[1]: any)
                              const impactYear = impact.countImpact[year]

                              const percentageImpact = (impactYear / impact.count) * 100
                              return {
                                x: name,
                                y: percentageImpact,
                                header: '',
                                subhead: `FTE ${ HumanNumber(impactYear, '', 2) }`,
                                value: `(${ percentageImpact.toFixed(2) }%)`,
                                label: '',
                              }
                            }),
                            sortBy(i => i.y),
                            takeRight(20),
                          )(data)
                        }
                        labelComponent={ (
                          <LabelTooltip horizontal={ false } dx={ -10 } />
                        ) }
                      />
                      <VictoryAxis
                        dependentAxis
                      />

                      <VictoryAxis
                        tickLabelComponent={
                          <VictoryLabel text={ x => `${ x }%` } />
                        }
                        axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
                        label='% FTE Impact'
                      />
                    </VictoryChart>
                  </div>
                )
              }
              <div className={ classnames(styles.percentageSwitch, styles.switchButton) }>
                <Button
                  onClick={ () => this.setState({ percentageChart: false }) }
                  className={ this.state.percentageChart ? 'not-selected' : '' }
                >Number Impact
                </Button>
                <Button
                  onClick={ () => this.setState({ percentageChart: true }) }
                  className={ !this.state.percentageChart ? 'not-selected' : '' }
                >Percentage Impact
                </Button>
              </div>
            </div>
          )
          : null
        }
        <Filter>

          <Slider
            label='Years'
            options={ this.state.filterOptions.year }
            value={ this.state.filters.year }
            onChange={ value => {
              this.setState({ filters: { ...this.state.filters, year: value } })
            } }
          />

          <Dropdown
            label='Technology Class'
            value={ this.state.filters.techs }
            options={ this.state.filterOptions.techs }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, techs: values } })
            } }
          />

          <Dropdown
            label='Location'
            value={ this.state.filters.location }
            options={ this.state.filterOptions.location }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, location: values } })
            } }
          />

          <Dropdown
            label='Business Unit'
            value={ this.state.filters.businessUnit }
            options={ this.state.filterOptions.businessUnit }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, businessUnit: values } })
            } }
          />

          <Dropdown
            label='Department'
            value={ this.state.filters.department }
            options={ this.state.filterOptions.department }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, department: values } })
            } }
          />

          <Dropdown
            label='Age'
            value={ this.state.filters.age }
            options={ this.state.filterOptions.age }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, age: values } })
            } }
          />

          <Dropdown
            label='Employee Level'
            value={ this.state.filters.employeeLevel }
            options={ this.state.filterOptions.employeeLevel }
            onChange={ values => {
              this.setState({ filters: { ...this.state.filters, employeeLevel: values } })
            } }
          />

        </Filter>
      </Flex>
    )
  }
}

export default Report
