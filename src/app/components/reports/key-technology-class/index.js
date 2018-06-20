/* @flow */

import React, { Component, type Element } from 'react'
import { Flex, Dropdown, type DropdownOptions as Options } from 'ui'

import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
} from 'victory'

import {
  flow,
  map,
  sortBy,
  sortedUniq,
  compact,
  filter,
  entries,
  reduce,
} from 'lodash/fp'

import { techImpact, employeeKeys, findAgeRange } from 'tandem/aggs'

import { type Dataset } from 'tandem'

import { keyTechDisplayName, keyTechFilterOptions } from '../keyTechMeta'

import { reportsTitle } from '../reports-names'

import Legend from '../Legend'
import Filter from '../Filter'
import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'
import Navigation from '../Navigation'

import theme, { colors } from '../theme'

import LabelComp from '../label'

import styles from '../styles.scss'

type Props = {
  dataset: Dataset,
  // location: {
  //   pathname: string
  // }
}

type State = {

  filters: {
    year: number,
    businessUnit: Options,
    location: Options,
    techs: Options,
    employeeLevel: Options,
    age: Options,
    department: Options,
  },

  filterOptions: {
    businessUnit: Options,
    location: Options,
    techs: Options,
    employeeLevel: Options,
    department: Options,
    age: Options,
  },

}

const techColors: { [string]: string } = {
  Social_AI: styles.lightOrange, // eslint-disable-line css-modules/no-undef-class
  Process_AI: styles.primaryColor, // eslint-disable-line css-modules/no-undef-class
  Mobile_Robotics: styles.darkishGray, // eslint-disable-line css-modules/no-undef-class
  In_Place_Robotics: styles.lighterGray, // eslint-disable-line css-modules/no-undef-class
  Materials: styles.lightGray2, // eslint-disable-line css-modules/no-undef-class
}

const legendContent = {
  'Process AI': {
    color: colors[0],
    content: 'Advanced analytics, machine learning and other disciplines of artificial intelligence applied to diverse data sets for optimisation and prediction. Replacing and augmenting human judgement in areas that have been considered to require experience or the ability to consider a complex and changing context in decision making.',
  },
  'Social AI': {
    color: colors[1],
    content: 'Artificial intelligence and machine learning applied to interacting with people, understanding human intent, and anticipating people’s needs. Social AI covers the understanding of human speech and ‘conversational’ interfaces whether spoken or in text form. Social AI applications replace labour in contact centres and help desks, or other business processes where time is spent answering queries, providing or obtaining information from people, and interpreting human communication, such as sales and customer service.',
  },
  'Fixed Robotics': {
    color: colors[3],
    content: 'Fixed robotics applications involve machines manipulating physical objects and materials in a controlled, often industrial environment such as a factory, potentially requiring movement through that environment as well. Industrial machinery and robotics are already quite mature and in widespread use; what distinguishes this next wave is often the ability to work fully autonomously, without requiring a human operator, and to work in concert with other machines as part of a fully coordinated manufacturing process flow or supply chain. Fixed Robotics are automating increasingly complex tasks in production, often working in combination with Process AI to replace manual production planning or process control.',
  },
  'Mobile Robotics': {
    color: colors[4],
    content: 'Mobile robotics involves machines interacting with an uncontrolled, unpredictable physical environment, often outside an industrial context. This includes autonomous or semiautonomous vehicles, machines interacting directly with customers in a service or care context, and a range of security and defence applications. Mobile robotics automates a range of physical work that has hitherto required human judgement and situation awareness due to the environment in which the work takes place.',
  },
  'Advanced Materials': {
    color: colors[2],
    content: 'Advanced materials applications affect work related to the care and maintenance, identification, or handling of materials through properties that minimise or eliminate the need for that work. Such materials might employ nanoscale properties to minimise maintenance; respond to chemical, thermal or other stimuli by changing colour, RFID signature, or other attributes; or by having mechanical properties that reduce or eliminate handling, and which potentially change through time or on demand (i.e. ‘smart materials’).',
  },
}

export default class Report extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      filters: {
        businessUnit: [],
        techs: [],
        location: [],
        department: [],
        age: [],
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

        department: flow(
          map(e => e[employeeKeys.department]),
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

        employeeLevel: flow(
          map(e => e[employeeKeys.employeeLevel]),
          sortBy(i => i),
          sortedUniq,
          compact,
          map(value => ({ value, label: value })),
        )(props.dataset.employeeData),

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
    const data = flow(
      techImpact(this.props.dataset.model, {
        businessUnit: this.state.filters.businessUnit,
        location: this.state.filters.location,
        age: this.state.filters.age,
        department: this.state.filters.department,
        employeeLevel: this.state.filters.employeeLevel,
      }),
      entries,
      sortBy(i => -i[1]['15']),
    )(this.props.dataset.employeeData)

    this.svgs.top.node = null
    this.svgs.bottom.node = null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >
        <Header
          title={ reportsTitle.keyTechnologyClass }
          description='Which emerging technologies are driving the most opportunity across your business and when will this happen?'
        />
        <DownloadChart svgs={ this.svgs } />
        <Navigation currentReport={ reportsTitle.keyTechnologyClass } />

        <div className={ styles.chartArea }>
          <VictoryChart
            theme={ theme }
            padding={ { left: 50, bottom: 30, top: 10, right: 10 } }
            containerComponent={
              <VictoryContainer
                events={ {
                  ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
                } }
              />
            }
          >
            <VictoryAxis
              axisLabelComponent={ <VictoryLabel dy={ -65 } /> }
              label='Salary Cost'
              dependentAxis
              tickFormat={ x => HumanNumber(x, '', 0) }
            />
            <VictoryAxis
              axisLabelComponent={ <VictoryLabel dy={ 35 } /> }
              label='Year'
              tickValues={ [1, 5, 10, 15] }
              tickFormat={ y => y }
            />
            <VictoryStack>
              {
                flow(

                  filter((selector => {
                    if (!selector.length) { return () => true }
                    const selectorValues = selector.map(i => i.value)
                    return ([tech]) => selectorValues.indexOf(tech) > -1
                  })(this.state.filters.techs)),

                  map(([tech, values]) => {
                    return (
                      <VictoryArea
                        key={ tech }
                        name={ tech }

                        style={ {
                          data: {
                            fill: () => techColors[tech],
                          },
                        } }

                        // We only show from year 1 t o 15
                        data={ Object.entries(values).slice(1).map(
                          ([x, y]) => ({
                            x,
                            y,
                            header: keyTechDisplayName[tech].toUpperCase(),
                            subhead: `Year ${ parseInt(x, 10) - 1 }`,
                            value: `$${ HumanNumber(y, '', 2) }`,
                            label: '',
                          }),
                        ) }

                        containerComponent={
                          <VictoryVoronoiContainer />
                        }

                        labelComponent={
                          <LabelComp
                            dy={ -10 }
                          />
                        }
                      />
                    )
                  }),
                )(data)
              }
            </VictoryStack>
          </VictoryChart>
        </div>

        <Legend
          headers={ data.map(([tech]) => keyTechDisplayName[tech]) }
          legendContent={ legendContent }
        />

        <Filter>

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
