/* @flow */

import React, { Component, type Element } from 'react'

import { Spinner } from '@blueprintjs/core'

import { Flex, Slider, Dropdown, type DropdownOptions as Options } from 'ui'

// import { intword as HumanNumber } from 'humanize-plus'

import {
  flow,
  entries,
  map,
  sortBy,
  sortedUniq,
  compact,
  range,
  reduce,
} from 'lodash/fp'


import { type Dataset } from 'tandem'
import {
  locImpact,
  employeeKeys,
  findAgeRange,
} from 'tandem/aggs'

import { keyTechFilterOptions } from '../keyTechMeta'


import { reportsTitle } from '../reports-names'
import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

import Map from './map'
// import theme from '../theme'

import Chart from './chart'
// // import Label from './label'

import styles from '../styles.scss'

const googleMapURL = 'https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyBySzKLTKe2SoviJYvi1mbNR3ohkA3JoIc'

type Props = {
  dataset: Dataset,
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
    techs: Options,

    businessUnit: Options,
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
      locImpact(this.props.dataset.model, {
        businessUnit: this.state.filters.businessUnit,
        age: this.state.filters.age,
        department: this.state.filters.department,
        employeeLevel: this.state.filters.employeeLevel,
        techs: this.state.filters.techs,
      }),
      entries, /* need it for both bars, so do it once. */
    )(this.props.dataset.employeeData)

    this.svgs.top.node = null
    this.svgs.bottom.node = null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title={ reportsTitle.location }
          description='Which locations will experience the greatest impact?'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.location } />

        <div className={ styles.chartArea }>
          <div className={ styles.mapBox }>
            <Map
              googleMapURL={ googleMapURL }
              loadingElement={ <Spinner /> }
              containerElement={
                <div style={ { height: '100%' } } />
              }
              mapElement={
                <div style={ { height: '100%' } } />
              }
              data={ data }
              year={ year }
            />
          </div>
        </div>

        <hr className={ styles.hr } />

        <div className={ styles.chartArea }>
          <Chart
            data={ data }
            year={ year }
            svgs={ this.svgs }
          />
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
