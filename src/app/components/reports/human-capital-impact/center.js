/* @flow */
import React, { Component } from 'react'

// TODO: Fetch these from the theme.
const orange = { base: 'gold', highlight: 'darkOrange' }
const red = { base: 'tomato', highlight: 'orangeRed' }


type Props = {
  origin: {
    x: number,
    y: number,
  }
}

export default class CompassCenter extends Component<Props> {
  static defaultProps = {
    origin: { x: 0, y: 0 },
  }

  render() {
    const { origin } = this.props
    const circleStyle = {
      stroke: red.base,
      strokeWidth: 2,
      fill: orange.base,
    }

    return (
      <g>
        <circle
          cx={ origin.x }
          cy={ origin.y }
          r={ 35 }
          style={ circleStyle }
        />
      </g>
    )
  }
}
