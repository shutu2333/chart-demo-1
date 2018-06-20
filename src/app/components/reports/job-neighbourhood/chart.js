/* @flow */
import React, { Component } from 'react'

import { Flyout } from 'victory'

import { voronoi } from 'd3-voronoi'
import { scaleLinear as linear } from 'd3-scale'

// import { intword as HumanNumber } from 'humanize-plus'

import bindClassNames from 'classnames/bind'

import { employeeKeys } from 'tandem/aggs'

import { type Dataset } from 'tandem'

import jobNeighbourhoods from './data.json'

import { Label } from '../label'
import chartStyles from './styles.scss'
import reportStyles from '../styles.scss'

import theme from '../theme'


const cx = bindClassNames.bind(chartStyles)

export type Job = {
  x: number,
  y: number,
  fill: string,
  label: string,
  ours: boolean,
}

export const colors = [
  '#487F64',
  '#7B8797',
  '#C4C7CF',
  '#FFEDCE',
  '#A19270',
  '#D2C7B0',
  '#E9E5DA',
  '#D7BCB6',
  '#929C84',
  '#A1D9C0',
  '#93759F',
  '#71615C',
  '#7E975E',
  '#9E675E',
  '#94570F',
]


type Props = {
  dataset: Dataset,
  // XXX(ome): Figure out HOC typing issue.
  // The SVG Ref type might need to be exported from
  // DownloadChart and used it, or actually clean up the
  // whole mess.
  // svgRef: (?Element<*>) => mixed,
  svgRef: (any) => mixed,
  set: number,
}

type TooltipData = {
  x: number,
  y: number,

  header: string,
  subhead: string,
  value: string,
}

type State = {
  data: Array<$Shape<Job>>,
  tooltip: ?TooltipData,


  v: {
    polygons: (Array<{
      x: number,
      y: number
    }>) => Array<*>,
  },
}


const Tooltip = (props: TooltipData) => {
  const width = (Math.max(
    (props.header && props.header.length * 1.2) || 0,
    (props.subhead && props.subhead.length) || 0,
    (props.value && props.value.length) || 0,
  ) * 12) + 20

  return (
    <g pointerEvents='none'>
      <Flyout
        x={ props.x }
        y={ props.y }
        width={ width }
        height={ 120 }
        pointerLength={ 10 }
        pointerWidth={ 10 }
        cornerRadius={ 10 }
        orientation='top'
      />
      <Label
        theme={ theme }
        x={ (props.x - (width / 2)) + 10 }
        y={ props.y - 60 }
        datum={ {
          header: props.header,
          subhead: props.subhead,
          value: props.value,
        } }
        dx={ -10 }
        dy={ 25 }

        fontSize={ 24 }
      />
    </g>
  )
}
const range = [1500, 1000]

export default class Chart extends Component<Props, State> {
  static defaultProps = {
    className: '',
  }

  constructor(props: Props, context: *) {
    super(props, context)

    const socs = props.dataset.employeeData.reduce(
      (os, e) => ({ ...os, [e[employeeKeys.SOCCode]]: e[employeeKeys.SOCName] }), {},
    )

    const rangeYMap = linear()
      .domain(jobNeighbourhoods.meta.domain)
      .range([990, 10])

    const rangeXMap = linear()
      .domain(jobNeighbourhoods.meta.domain)
      .range([10, 1490])

    const data: Array<Job> = jobNeighbourhoods.jobs.map(e => ({
      x: rangeXMap(e[3]),
      y: rangeYMap(e[4]),

      // eslint-disable-next-line css-modules/no-undef-class
      stroke: reportStyles.primaryColor,
      strokeWidth: 0,
      fill: colors[e[2]],
      ours: Boolean(socs[e[0]]),

      header: e[1],
      subhead: jobNeighbourhoods.meta.labels[e[2]],
      value: `P: ${ (e[5] || 0).toFixed(2) }`,
      label: ' ',
    }))


    const v = voronoi()
    v.x(e => parseInt(e.x, 10))
    v.y(e => parseInt(e.y, 10))
    v.extent([[0, 0], range])

    this.state = {
      data,
      v,
      tooltip: null,
    }
  }

  render() {
    const data = this.state.data.filter(
      e => this.props.set !== 2 || e.ours,
    )

    return (

      <svg
        ref={ this.props.svgRef }
        width='100%'
        height='100%'
        xmlns='http://www.w3.org/2000/svg'
        viewBox={ `0 0 ${ range.join(' ') }` }
        onMouseOut={ () => this.setState({ tooltip: null }) }
        onBlur={ () => this.setState({ tooltip: null }) }

        className={ cx({ withOurs: this.props.set === 1 }) }
      >
        <g>
          {
            this.state.v.polygons(data).map((p, i) => {
              const k = `polygon-${ i }`
              const d = p.data

              const setTooltip = () => {
                const value = (this.state.tooltip && this.state.tooltip.subhead === d.subhead)
                  ? null
                  : {
                    x: d.x,
                    y: d.y,
                    header: d.header,
                    subhead: d.subhead,
                    value: d.value,
                  }
                this.setState({ tooltip: value })
              }

              return (
                <polygon
                  key={ k }
                  points={ p.map(e => (e ? e.join(',') : '')).join(' ') }
                  fill='transparent'
                  onMouseOver={ setTooltip }
                  onFocus={ setTooltip }
                  onTouchEnd={ setTooltip }
                />
              )
            })
          }
        </g>
        <g pointerEvents='none'>
          {
            data.map((d, i) => {
              const k = `circle-${ i }`
              return (
                <circle
                  className={ cx({ point: true, ours: d.ours }) }
                  key={ k }
                  cx={ d.x }
                  cy={ d.y }
                  fill={ d.fill }
                  r={ 5 }
                />
              )
            })
          }
        </g>
        { this.state.tooltip && <Tooltip { ...this.state.tooltip } /> }
      </svg>
    )
  }
}
