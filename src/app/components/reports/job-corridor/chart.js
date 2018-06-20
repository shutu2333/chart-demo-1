/* @flow */

import React, { Component, type Element } from 'react'
// import { intword as HumanNumber } from 'humanize-plus'

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  // VictoryLabel,
  VictoryContainer,
} from 'victory'

import LabelComp from '../label'
import theme from '../theme'
import styles from '../styles.scss'
import Arrow from './Arrow'

export type ChartElement = {
  code: string,
  type: string,
  value: number,
  x: string,
  y0: number,
  y: number,
}

type State = {
  elements: Array<ChartElement>,
}

type Props = {
  elements: Array<ChartElement>,
}

export default class JobCorrirdorChart extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = { elements: this.props.elements }

    this.svgs = {
      top: { node: null },
      bottom: { node: null },
    }
  }

  componentWillReceiveProps(nextProps: Props) {
  // TODO: Remove once VictoryAxis not updating bug is fixed
  // https://github.com/FormidableLabs/victory/issues/699

    this.setState(
      { elements: [] },
      () => this.setState({ elements: nextProps.elements }),
    )
  }

  svgs: {
    top: { node: ?Element<*> },
    bottom: { node: ?Element<*> },
  }

  render() {
    return (
      <div className={ styles.chartArea } style={ { height: 'auto', marginTop: '30px', width: '40vw' } }>
        <VictoryChart
          theme={ theme }
          height={ 80 * this.props.elements.length }
          padding={ { left: 60, bottom: 20, top: 10, right: 20 } }
          domainPadding={ { x: 50, y: 50 } }
          containerComponent={
            <VictoryContainer
              events={ {
                ref: svg => { if (!this.svgs.top.node) { this.svgs.top.node = svg } },
              } }
            />
          }
        >

          <VictoryAxis dependentAxis />
          <VictoryAxis
            orientation='top'
            tickValues={ [0, 0.2, 0.4, 0.6, 0.8, 1.0] }
          />

          <VictoryBar
            horizontal
            labelComponent={ (
              <LabelComp dy={ -5 } />
        ) }
            data={ this.state.elements }
            dataComponent={ <Arrow /> }
            style={ {
              data: {
            // fill: d => colors[d.type],
                fill: d => (
              d.value > 0.2
              // eslint-disable-next-line css-modules/no-undef-class
              ? styles.primaryColor
              // eslint-disable-next-line css-modules/no-undef-class
              : styles.lighterGray
            ),
              },
            } }
          />
        </VictoryChart>
      </div>

    )
  }
}
