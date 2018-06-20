/* @flow */

import React, { Component, type Element } from 'react'
import { scaleLinear as linear } from 'd3-scale'
import { Flex, Slider, Dropdown, type DropdownOptions as Options } from 'ui'

import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryStack,
  VictoryBar,
  // VictoryAxis,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryContainer,
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
  thru,
} from 'lodash/fp'


import {
  // budgetImpact,
  humanImpact,
  employeeKeys,
  findAgeRange,
} from 'tandem/aggs'

import { type Dataset } from 'tandem'

import { keyTechFilterOptions } from '../keyTechMeta'

import { reportsTitle } from '../reports-names'

import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

import theme from '../theme'
import LabelComp from '../label'

import styles from '../styles.scss'

type Props = {
  dataset: Dataset,
}

// type groupImpact = {
//   count: number,
//   sumTotallCompensation: number,
//   compensationImpact: Array<number>,
//   countImpact: Array<number>,
// }

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

const Empty = () => (<g />)

function fillColor(d, i) {
  if (d.x === 'F') {
    // eslint-disable-next-line css-modules/no-undef-class
    return i ? styles.primaryColor : styles.lightOrange
  }
  // eslint-disable-next-line css-modules/no-undef-class
  return i ? styles.lighterGray : styles.lightGray2
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

    // const data = flow(
    //   budgetImpact(this.props.dataset.model, {
    //     businessUnit: this.state.filters.businessUnit,
    //     location: this.state.filters.location,
    //     techs: this.state.filters.techs,
    //   }),
    //   entries,
    //   sortBy(i => (i[1].count)),
    // )(this.props.dataset.employeeData)

    const genderData = flow(
      humanImpact(this.props.dataset.model, {
        businessUnit: this.state.filters.businessUnit,
        location: this.state.filters.location,
        age: this.state.filters.age,
        department: this.state.filters.department,
        employeeLevel: this.state.filters.employeeLevel,
        techs: this.state.filters.techs,
      }),
      entries,
      map(i => i[1]),
      reduce((total, impact) => {
        if (impact.M) {
          total.M.count += impact.M.count
          total.M.countImpact += impact.M.countImpact[year]
        }

        if (impact.F) {
          total.F.count += impact.F.count
          total.F.countImpact += impact.F.countImpact[year]
        }

        return total
      }, {
        M: { count: 0, countImpact: 0 },
        F: { count: 0, countImpact: 0 },
      }),
      thru(gi => [
        [
          {
            x: 'M',
            y: gi.M.count - gi.M.countImpact,
            y0: 0,
            label: '',
            header: 'Males',
            subhead: 'Not Impacted',
            value: `FTE ${ HumanNumber(gi.M.count - gi.M.countImpact, ' ', 2) } (${ ((gi.M.count - gi.M.countImpact) / gi.M.count * 100).toFixed(2) }% )`,
          },
          {
            x: 'F',
            y: gi.F.count - gi.F.countImpact,
            y0: 0,
            label: '',
            header: 'Females',
            subhead: 'Not Impacted',
            value: `FTE ${ HumanNumber(gi.F.count - gi.F.countImpact, ' ', 2) } (${ ((gi.F.count - gi.F.countImpact) / gi.F.count * 100).toFixed(2) }% )`,
          },
        ],
        [
          {
            x: 'M',
            y: gi.M.countImpact,
            y0: gi.M.count - gi.M.countImpact,
            label: '',
            header: 'Males',
            subhead: 'Impacted',
            value: `FTE ${ HumanNumber(gi.M.countImpact, ' ', 2) } (${ (gi.M.countImpact / gi.M.count * 100).toFixed(2) }% )`,
          },
          {
            x: 'F',
            y: gi.F.countImpact,
            y0: gi.F.count - gi.F.countImpact,
            label: '',
            header: 'Females',
            subhead: 'Impacted',
            value: `FTE ${ HumanNumber(gi.F.countImpact, ' ', 2) } (${ (gi.F.countImpact / gi.F.count * 100).toFixed(2) }% )`,
          },
        ],
      ]),
    )(this.props.dataset.employeeData)

    const niceTicks = linear()
      .domain([
        0,
        Math.max(
          genderData[0][0].y + genderData[1][0].y,
          genderData[0][1].y + genderData[1][1].y,
          5,
        ),
      ])
      .nice()
      .ticks(10)

    const maxTick = Math.max(...niceTicks)
    this.svgs.top.node = null
    this.svgs.bottom.node = null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title={ reportsTitle.humanCapitalImpact }
          description='How will emerging technologies impact your workforce?  See how employees are impacted as well as how that impact differs by gender.'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.humanCapitalImpact } />

        <div className={ styles.chartArea } style={ { paddingLeft: '5vw' } }>
          <br />

          <VictoryChart
            polar
            theme={ theme }
            padding={ { left: 40, bottom: 0, top: 20, right: 100 } }
            innerRadius={ 50 }
            containerComponent={
              <VictoryContainer
                events={ {
                  ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                } }
              />
            }
          >
            <VictoryStack>
              {
                genderData.map((g, i) => (
                  <VictoryBar
                    labelComponent={ <LabelComp
                      angle={ 0.001 }
                      dx={ (d) => ((d.x === 'F' ? 1 : -1) * d.y / maxTick * 200) }
                      dy={ 20 }
                      pointerLength={ 0 }
                    /> }
                    key={ g[0].x }
                    data={ g }
                    style={ {
                      data: {
                        fill: d => fillColor(d, i),
                      },
                    } }
                  />
                ))
              }

            </VictoryStack>
            <VictoryPolarAxis
              style={ {
                parent: { fill: 'red', pointerEvents: 'none' },
              } }
              groupComponent={
                <g pointerEvents='none' role='presentation' />
              }
              dependentAxis
              tickValues={ niceTicks }
              tickFormat={ x => (x ? `${ HumanNumber(x, ' ', 1) }` : '') }
              axisAngle={ 90 }
              axisComponent={ <Empty /> }
              tickLabelComponent={
                <VictoryLabel
                  angle={ 0 }
                  dx={ 10 }
                  dy={ 20 }
                  textAnchor='start'
                />
              }
            />

            <VictoryPolarAxis
              groupComponent={
                <g pointerEvents='none' role='presentation' />
              }
              labelPlacement='parallel'

              // The following is a hack to force rerendering of the tick labeles
              // VictoryChart expects this function to be pure.
              tickValues={ [
                1,
                1.5,
                2,
                2.5,
              ] }
              tickFormat={ x => {
                if (x === 1) {
                  const total = genderData[0][0].y + genderData[1][0].y
                  //  const p = ((genderData[1][0].y / total) * 100).toFixed(2)
                  return `Males\nTotal: ${ total }` // \nImpacted: ${ p }%`
                }
                if (x === 2) {
                  const total = genderData[0][1].y + genderData[1][1].y
                  // const p = ((genderData[1][1].y / total) * 100).toFixed(2)
                  return `Females \nTotal: ${ total }` // \nImpacted: ${ p }%`
                }
                return ''
              } }
            />
          </VictoryChart>
        </div>

        <br />

        { /*
        <hr className={ styles.hr } />

        <br />
        <br />

        <div className={ styles.chartArea } style={ { width: '60vw', paddingRight: '9vw' } }>
          <VictoryChart
            theme={ theme }
            width={ 1200 }
            padding={ { left: 260, bottom: 80, top: 20, right: 80 } }
            containerComponent={
              <VictoryContainer
                // style={  }
                events={ {
                  ref: svg => { if (!this.svgs.bottom.node) { this.svgs.bottom.node = svg } },
                } }
              />
            }
          >

            <VictoryAxis
              dependentAxis
              tickValues={ data.map(org => org[0]) }
            />
            <VictoryAxis
              label='No. FTE'
              axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
              tickValues={ niceTicks }
              tickFormat={ x => `${ HumanNumber(x, ' ', 1) }` }
            />

            <VictoryStack horizontal >

              <VictoryBar
                key={ 'impact' }
                data={
                  data.map(org => {
                    const x : string = org[0]
                    const impact: groupImpact = (org[1]: any)
                    const y = impact.count - impact.countImpact[year]
                    return {
                      x,
                      y,
                      label: '',
                      header: 'Not Impacted',
                      subhead: `FTE ${ HumanNumber(y, '', 2) }`,
                      value: '',
                    }
                  })
                }
                style={ {
                  data: {
                    // eslint-disable-next-line css-modules/no-undef-class
                    fill: styles.lightGray2_1,
                  },
                } }
                labelComponent={ (
                  <LabelComp horizontal={ false } dx={ -10 } />
                ) }
              />
              <VictoryBar

                key={ 'total' }
                data={
                  data.map(org => {
                    const x : string = org[0]
                    const impact: groupImpact = (org[1]: any)
                    const y = impact.countImpact[year]
                    return {
                      x,
                      y,
                      label: '',
                      header: 'Impacted',
                      subhead: `FTE ${ HumanNumber(y, '', 2) }`,
                      value: '',
                    }
                  })
                }
                style={ {
                  data: {
                    // eslint-disable-next-line css-modules/no-undef-class
                    fill: styles.lightGray2_3,
                  },
                } }
                labelComponent={ (
                  <LabelComp horizontal={ false } dx={ -10 } />
                ) }
              />

            </VictoryStack>

          </VictoryChart>
        </div>

        */ }
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
