/* @flow */

import React, { Component, type Element } from 'react'
import { Flex, Slider } from 'ui'

import classnames from 'classnames'
import { type Dataset } from 'tandem'

import Header from '../../layout/Header'
import DownloadChart from '../DownloadChart'

import reportStyles from '../styles.scss'


import Chart from './chart'

type Props = {
  className?: string,
  dataset: Dataset,
}

type State = {
  set: number,
}


export default class JobNeighbourhood extends Component<Props, State> {
  static defaultProps = {
    className: '',
  }

  constructor(props: Props, context: *) {
    super(props, context)


    this.state = {
      set: 1,
    }

    this.svgs = {
      top: { node: null },
      bottom: { node: null },
    }
  }

  svgs: {
    top: { node: ?Element<*>},
    bottom: { node: ?Element<*>},
  }

  render() {
    this.svgs.top.node = null
    this.svgs.bottom.node = null
    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
        className={ classnames(this.props.className) }
      >
        <Header
          title='Job Neighbourhood'
          description='Navigate the universe of jobs to identify roles with low risk of automation'
        />
        <DownloadChart svgs={ this.svgs } />

        <div className={ reportStyles.chartArea }>
          <Chart
            dataset={ this.props.dataset }
            set={ this.state.set }
            svgRef={ svg => { if (svg) this.svgs.top.node = svg } }
          />
        </div>

        <div className={ reportStyles.jobNeighbourhoodsSlider }>
          <Slider
            label='Datasets'
            options={ [0, 1, 2] }
            renderLabel={ v => (<span>{ ['All Roles', 'Both', 'Your Roles'][v] }</span>) }
            onChange={ value => this.setState({ set: value }) }
            showTrackFill={ false }
            value={ this.state.set }
          />
        </div>

        <div className={ reportStyles.description }>
          <p>
            The job-neighbourhood model calculates a distance between each occupation, based on the
            skills applied in each - we use 160 skills (or 160 dimensions) as described by O*NET.
            To be able to visualise this high-dimensional space in 2D, we use a dimensionality
            reduction algorithm called t-distributed stochastic neighbour embedding.
            There are no X and Y axes, as the positioning is purely based on the distances
            between occupations.
            All occupations are then clustered into 15 groups using a K-means clustering algorithm.
          </p>
        </div>

      </Flex>
    )
  }
}
