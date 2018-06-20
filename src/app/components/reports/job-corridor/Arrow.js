import React, { Component } from 'react'
import {
  Helpers,
} from 'victory'

import { assign } from 'lodash'

export default class Bar extends Component {
  getPosition(props, width) {
    const size = width / 2
    const { x, y, y0 } = props
    return {
      y0: Math.round(y0),
      y1: Math.round(y),
      x0: Math.round(x - size),
      x1: Math.round(x + size),
    }
  }

  getHorizontalBarPath(props, width) {
    const { x0, x1, y0, y1 } = this.getPosition(props, width)
    return `M ${ y0 }, ${ x0 }
      L ${ y0 }, ${ x1 }
      L ${ y1 }, ${ x1 }
      L ${ y1 }, ${ x0 }
      L ${ y0 }, ${ x0 }
      z`
  }

  getBarPath(props, width) {
    return this.getHorizontalBarPath(props, width)
  }

  getBarWidth(props, style) {
    if (style.width) {
      return style.width
    }
    const { scale, data } = props
    const range = scale.x.range()
    const extent = Math.abs(range[1] - range[0])
    const bars = data.length + 2
    const barRatio = 0.5
    // eslint-disable-next-line no-magic-numbers
    const defaultWidth = data.length < 2 ? 8 : (barRatio * extent / bars)
    return Math.max(1, Math.round(defaultWidth))
  }

  calculateAttributes(props) {
    const { datum, active } = props
    const stroke = (props.style && props.style.fill) || 'black'
    const baseStyle = { fill: 'black', stroke }
    const style = Helpers.evaluateStyle(assign(baseStyle, props.style), datum, active)
    const width = this.getBarWidth(props, style)
    const path = this.getBarPath(props, width)
    return { style, path }
  }

  // Overridden in victory-core-native
  renderBar(path, style, position) {
    return (
      <g>
        <defs>
          <marker
            id={ `arrow-${ style.code }` }
            markerWidth='10'
            markerHeight='10'
            refX='0'
            refY='3'
            orient='auto'
            markerUnits='strokeWidth'
            viewBox='0 0 30 30'
          >
            <path d='M0,0 L0,6 L9,3 z' fill={ style.fill } />
          </marker>
        </defs>

        <line
          x1={ position.y0 }
          x2={ position.y1 }
          y1={ position.x0 + 18 }
          y2={ position.x0 + 18 }
          style={ {
            stroke: style.fill,
            strokeWidth: 6,
          } }
          markerEnd={ `url(#arrow-${ style.code })` }
        />

      </g>
    )
  }

  render() {
    const { style, path } = this.calculateAttributes(this.props)
    const width = this.getBarWidth(this.props, style)
    const position = this.getPosition(this.props, width)
    return this.renderBar(path, style, position)
  }
}
