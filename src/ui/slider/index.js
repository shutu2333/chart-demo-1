/* @flow */
import React, { Component, type Element } from 'react'
import { Slider } from '@blueprintjs/core'

import { Label } from 'ui'

import styles from './styles.scss'

export type Props = {
  label: string,
  options: Array<number>,
  onChange: Function,
  value: number,
  showTrackFill?: boolean,
  renderLabel?: (number) => Element<*> | string | null,
}

type State = {}

export default class SliderComponent extends Component<Props, State> {
  static defaultProps = {
    showTrackFill: true,
    renderLabel: (i: number) => i.toFixed(0),
  }


  render() {
    return (
      <div>
        <Label htmlFor='' >{ this.props.label }</Label>
        <div className={ styles.slider } style={ { position: 'relative' } }>
          <Slider
            min={ this.props.options[0] }
            max={ this.props.options[this.props.options.length - 1] }
            stepSize={ 1 }
            labelStepSize={ 1 }
            onChange={ (value) => this.props.onChange(value) }
            value={ this.props.value }
            showTrackFill={ this.props.showTrackFill }
            labelRenderer={ this.props.renderLabel }
          />
        </div>
      </div>
    )
  }
}
