/* @flow */
import React, { Component } from 'react'
// import classnames from 'classnames'

import {
  VictoryTooltip,
  Flyout,
} from 'victory'


// className={ classnames(styles.label, this.props.className) }
import styles from './styles.scss'

type LabelProps = {
  datum: Object,
  x: number,
  y: number,
  datum: {
    header: string,
    subhead: string,
    value: string,
  },

  dx: number,
  dy: number,

  fontSize?: number,
}

export function Label(props: LabelProps) {
  const datum = props.datum

  const subheadDy = datum.header ? '1.2em' : 0

  let valueDy = 0

  if (datum.header || datum.subhead) {
    valueDy = (datum.header && datum.subhead)
      ? '2.4em'
      : '1.2em'
  }

  return (
    <g
      style={ { pointerEvents: 'none' } }
      fill='red'
      width={ 2000 }
      height={ 2000 }
      transform={ `translate(${ props.x - props.dx }, ${ props.y - props.dy } )` }
      fontSize={ props.fontSize }
    >
      { datum.header
          ? (
            <text
              // eslint-disable-next-line css-modules/no-undef-class
              fill={ styles.primaryColor }
            >
              { datum.header.toUpperCase() }
            </text>
          )
          : null
      }
      { datum.subhead
          ? (
            <text
              fill='white'
              dy={ subheadDy }
            >
              { datum.subhead }
            </text>
          )
          : null
      }
      { datum.value
          ? (
            <text
              fill='white'
              dy={ valueDy }
            >
              { datum.value }
            </text>
          )
          : null
      }
    </g>
  )
}

Label.defaultProps = {
  fontSize: 16,
}

function calcDims(datum) {
  const maxCar = Math.max(
    (datum.header && datum.header.length) || 0,
    (datum.subhead && datum.subhead.length) || 0,
    (datum.value && datum.value.length) || 0,
  )

  const width = (maxCar + 2) * 11

  let height = 40

  if (datum.header) {
    height += 20
  }

  if (datum.subhead) {
    height += 20
  }

  if (datum.value) {
    height += 20
  }

  return {
    width,
    height,
  }
}

type Props = {
  pointerLength?: number,
}

export default class Reports extends Component<Props> {
  static defaultEvents = [{
    target: 'data',
    eventHandlers: {

      onMouseOver: () => ({
        target: 'labels',
        mutation: () => ({ active: true }),
      }),

      onMouseOut: () => ({
        target: 'labels',
        mutation: () => ({ active: false }),
      }),

      onTouchStart: () => ({
        eventKey: 'all',
        target: 'labels',
        mutation: () => ({ active: false }),
      }),

      onTouchEnd: () => ({
        target: 'labels',
        mutation: (p: *) => {
          if (!p.data) {
            return { active: !p.active }
          }

          if (p.data.activeIndex === p.index) {
            p.data.activeIndex = -1
            return ({ active: false })
          }

          p.data.activeIndex = p.index
          return ({ active: true })
        },
      }),
    },
  }]

  static defaultProps = {
    pointerLength: 10,
  }

  render() {
    // $FlowFixMe: flow doesn't understand injected props
    const dims = calcDims(this.props.datum) // eslint-disable-line react/prop-types
    return (
      <VictoryTooltip
        { ...this.props }
        renderInPortal={ true }
        cornerRadius={ 0 }
        flyoutStyle={ {
          strokeWidth: 0,
          width: 20,
          // eslint-disable-next-line css-modules/no-undef-class
          fill: styles.darkGray,
        } }

        labelComponent={

          // $FlowFixMe: flow doesn't understand injected props
          <Label
            dx={ (dims.width / 2) - 20 }
            dy={ dims.height / 2 }
          />
        }

        flyoutComponent={
          <Flyout { ...dims } pointerLength={ this.props.pointerLength } />
        }
      />
    )
  }
}
