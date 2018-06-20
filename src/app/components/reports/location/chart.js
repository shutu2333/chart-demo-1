/* @flow */

import React, { Component, type Element } from 'react'

import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
} from 'victory'


import {
  flow,
  map,
  takeRight,
  sortBy,
} from 'lodash/fp'

import theme from '../theme'
import styles from '../styles.scss'
import ReportLabel from '../label'

type Props = {
  data: Array<any>,
  year: number,
  svgs: {
    bottom: { node: ?Element<*> },
  }
}

type orgImpact = {
  count: number,
  sumTotalCompensation: number,
  compensationImpact: Array<number>,
  countImpact: Array<number>,
}

export default class Chart extends Component<Props> {
  render() {
    const data = flow(
      map(org => {
        const name: string = org[0]
        const impact: orgImpact = (org[1]: any)
        return {
          y: Math.ceil(impact.countImpact[this.props.year]),
          x: name,
          sumTotalCompensation: impact.sumTotalCompensation,
          header: name,
          subhead: '',
          value: `FTE ${ Math.ceil(impact.countImpact[this.props.year]) }`,
          label: '',
        }
      }),

      sortBy(i => i.y),
      takeRight(20),
    )(this.props.data)

    return (
      <VictoryChart
        theme={ theme }
        width={ 800 }
        height={ 600 }
        padding={ { left: 150, bottom: 80, top: 20, right: 20 } }
        domainPadding={ { x: 50, y: 50 } }
        containerComponent={
          <VictoryContainer
            events={ {
              ref: svg => {
                if (!this.props.svgs.bottom.node) { this.props.svgs.bottom.node = svg }
              },
            } }
          />
        }
      >
        <VictoryAxis
          dependentAxis
        />
        <VictoryAxis
          label='No. FTE Impact'
          axisLabelComponent={ <VictoryLabel dy={ 45 } /> }
          tickLabelComponent={
            <VictoryLabel
              textAnchor='start'
              text={ x => `${ HumanNumber(x, '', 0) }` }
            />
          }
        />
        <VictoryBar
          horizontal
          labels={ d => `${ JSON.stringify(d) }` }
          labelComponent={ (
            <ReportLabel horizontal={ false } dx={ -10 } />
          ) }

          style={ {
            data: {
              fill: styles.primaryColor, // eslint-disable-line css-modules/no-undef-class
            },
          } }

          data={ data }
        />
      </VictoryChart>
    )
  }
}
