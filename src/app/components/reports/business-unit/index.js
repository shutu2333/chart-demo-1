/* @flow */

import React, { Component, type Element } from 'react'
import { scaleLinear as linear } from 'd3-scale'

import { Flex, Slider, Dropdown, type DropdownOptions as Options } from 'ui'

import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
} from 'victory'

import {
  flow,
  map,
  entries,
  range,
  sortBy,
  sortedUniq,
  compact,
  reduce,
} from 'lodash/fp'

import { type Dataset } from 'tandem'

import { budgetImpact, employeeKeys, findAgeRange } from 'tandem/aggs'

import { reportsTitle } from '../reports-names'

import { keyTechFilterOptions } from '../keyTechMeta'


import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

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
  sumTotallCompensation: number,
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

    const units = flow(
      budgetImpact(this.props.dataset.model, {
        businessUnit: [],
        location: [],
        age: [],
        department: [],
        employeeLevel: [],
        techs: [],
      }),
      entries,
    )(this.props.dataset.employeeData)


    this.sizeMap =
      linear()
        .domain([
          0,
          Math.max.apply(null, units.map(org => org[1].compensationImpact[15])),
        ])
        .range([10, 80])


    this.colors = units.map(org => org[0]).reduce(
      (cs, d, i) => {
        cs[d] = colors[i] ? colors[i] : colors[colors.length - 1]
        return cs
      },
      {},
    )
  }

  svgs: {
    top: { node: ?Element<*> },
    bottom: { node: ?Element<*> },
  }

  sizeMap: (number) => number

  colors: { [string]: string }

  render() {
    const year = this.state.filters.year

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
        const compensationImpact = (impact.compensationImpact[year])
        return {
          x: impact.countImpact[year],
          y: (impact.countImpact[year] / impact.count) * 100,
          z: compensationImpact,
          size: this.sizeMap(compensationImpact),
          fill: this.colors[name],
          header: name.toUpperCase(),
          subhead: `$${ HumanNumber(compensationImpact, '', 2) }`,
          value: `${ Math.round(impact.countImpact[year]) } FTE`,
          label: '',
        }
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
          title={ reportsTitle.businessUnit }
          description='Which business units have the greatest opportunity to reduce total FTE through automation and augmentation?'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.businessUnit } />

        <div className={ styles.chartArea }>
          <VictoryChart
            theme={ theme }
            padding={ { left: 50, bottom: 30, top: 10, right: 10 } }
            domainPadding={ { x: 100, y: 100 } }
            containerComponent={
              <VictoryContainer
                events={ {
                  ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                } }
              />
            }
          >
            <VictoryAxis
              axisLabelComponent={ <VictoryLabel dy={ -55 } /> }
              label='% FTE at Risk'
              dependentAxis
              tickFormat={ y => `${ y }%` }
            />
            <VictoryAxis
              axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
              label='No. FTE at Risk'
              tickFormat={ x => HumanNumber(x, '', 1) }
            />
            <VictoryScatter
              labels={ d => `${ JSON.stringify(d) }` }
              labelComponent={ (
                <LabelComp dy={ 5 } />
              ) }

              data={ [{ x: 0, y: 0, z: 0 }, ...data] }
            />
          </VictoryChart>
        </div>

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
