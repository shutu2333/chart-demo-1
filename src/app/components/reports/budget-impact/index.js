/* @flow */

import React, { Component, type Element } from 'react'
import { Flex, Slider, Dropdown, type DropdownOptions as Options } from 'ui'

import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryVoronoiContainer,
} from 'victory'


import {
  flow,
  entries,
  map,
  reduce,
  range,
  sortBy,
  sortedUniq,
  compact,
  tap,
} from 'lodash/fp'

import { type Dataset } from 'tandem'
import { budgetImpact, employeeKeys, findAgeRange } from 'tandem/aggs'

import { reportsTitle } from '../reports-names'

import { keyTechFilterOptions } from '../keyTechMeta'


import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

// import theme from '../theme'

import LabelComp from '../label'

import theme, { colors } from '../theme'

import styles from '../styles.scss'


type Props = {
  dataset: Dataset,
  // location: {
  //   pathname: string
  // }
}

type orgImpact = {
  count: number,
  sumTotalCompensation: number,
  compensationImpact: Array<number>,
  countImpact: Array<number>,
}

type State = {

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

class Report extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
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

    // TODO: Like most of charts, some phase of this maybe
    // moved to componentWillMount, depending on the filters.
    const data = flow(
      budgetImpact(this.props.dataset.model, {
        businessUnit: this.state.filters.businessUnit,
        location: this.state.filters.location,
        age: this.state.filters.age,
        department: this.state.filters.department,
        employeeLevel: this.state.filters.employeeLevel,
        techs: this.state.filters.techs,
      }),
      entries,
      map(org => {
        const name: string = org[0]
        const impact: orgImpact = (org[1]: any)

        return {
          x: name,
          y: (impact.compensationImpact[year]),
          sumTotalCompensation: impact.sumTotalCompensation,
          header: `${ name.toUpperCase() }`,
          // XXX: These values exist so that flowtype can see the whole flow chain,
          // maybe replaced with types.
          y0: 0,
          currentStatePercentage: 0,
          label: '',
          value: '',
          subhead: '',
        }
      }),

      sortBy(i => -i.y),

      // Total
      reduce((group, impact: {
        sumTotalCompensation: number,
        y: number,
        y0: number,
        value: string,
        label: string,
        subhead: string,
      }) => {
        group[0].y += impact.sumTotalCompensation
        group.push(impact)

        return group
      },
      [{
        x: 'Current State',
        y: 0,
        header: 'Current State',
        // XXX: These values exist so that flowtype can see the whole flow chain,
        // maybe replaced with types.
        y0: 0,
        label: '',
        value: '',
        subhead: '',
      }]),

      // Scaling and total unimpacted
      tap(impacts => {
        const total = impacts[0].y
        const totalImpact = impacts.slice(1).reduce((impacted, i) => impacted + i.y, 0)

        impacts[0].value = `${ HumanNumber(total, '', 2) }`

        let lastY = total
        impacts.slice(1).map((impact) => {
          const realY = impact.y
          const currentStatePercentage = (realY / total) * 100
          lastY -= impact.y
          impact.y0 = lastY
          impact.y += lastY
          impact.label = ''
          impact.subhead = `$${ HumanNumber(realY, '', 2) }`
          impact.value = `${ currentStatePercentage.toFixed(2) }% of Current State`
          return impact
        })

        impacts.push({
          x: 'Future State',
          y: total - totalImpact,
          header: 'Future State',
          subhead: '',
          value: `${ HumanNumber(total - totalImpact, '', 2) }`,
          label: '',
          y0: 0,
        })
      }),
    )(this.props.dataset.employeeData)

    this.svgs.top.node = null
    this.svgs.bottom.node = null


    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title={ reportsTitle.budgetImpact }
          description='What is the overall reduction to salary costs following a program of automation/augmentation?'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.budgetImpact } />

        <div className={ styles.chartArea }>
          <VictoryChart
            theme={ theme }
            padding={ { left: 60, bottom: 130, top: 10, right: 20 } }
            domainPadding={ { x: 50, y: 50 } }
            containerComponent={
              <VictoryVoronoiContainer
                events={ {
                  ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                } }
              />
            }
          >
            <VictoryAxis
              label='Salary Cost'
              dependentAxis
              tickFormat={ y => `${ HumanNumber(y, ' ', 1) }` }
              axisLabelComponent={ <VictoryLabel dy={ -70 } dx={ 50 } /> }
            />
            <VictoryAxis
              tickLabelComponent={
                <VictoryLabel
                  angle={ 25 }
                  textAnchor='start'
                />
              }
            />
            <VictoryBar
              labelComponent={ (
                <LabelComp dy={ -5 } />
              ) }

              data={ data }
              style={ {
                data: {
                  fill: d => (
                    (d.x === 'Current State' || d.x === 'Future State')
                    ? colors[8]
                    : colors[0]
                  ),
                },
              } }
            />
          </VictoryChart>
        </div>

        <Filter>
          <Slider
            label='Years'
            options={ this.state.filterOptions.year }
            onChange={ value => {
              this.setState({ filters: { ...this.state.filters, year: value } })
            } }
            value={ this.state.filters.year }
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
