/* @flow */

import React, { Component } from 'react'

import {
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow,
  withScriptjs,
} from 'react-google-maps'

import { intword as HumanNumber } from 'humanize-plus'

import { scaleLinear as linear } from 'd3-scale'

import mapStyle from './mapstyle'
import styles from '../styles.scss'

// import theme from '../theme'

// // import Label from './label'

type InfoWindowProps = {
  name: ?string,
  year: number,
  data: Array<any>,
  onCloseClick: () => void,
}

const InfoTooltip = (props: InfoWindowProps) => {
  if (!props.name) return null

  const org = props.data.find(i => i[0] === props.name)

  if (!org) return null

  const impact: {
      latitude: number,
      longitude: number,
      countImpact: Array<number>,
      count: number,
      compensationImpact: Array<number>,
  } = (org[1]: any)

  const y = props.year
  const countImpact = impact.countImpact[y]
  const percentCountImpact = (impact.countImpact[y] / impact.count) * 100
  const compensationImpact = impact.compensationImpact[y]

  return (
    <InfoWindow
      position={ {
        lat: impact.latitude,
        lng: impact.longitude,
      } }
      onCloseClick={ () => props.onCloseClick() }
    >
      <div>
        { Math.ceil(countImpact) } FTE ({ percentCountImpact.toFixed(2) }%)
        <br />
        ${ HumanNumber(compensationImpact) }
      </div>
    </InfoWindow>
  )
}

type Props = {
  data: Array<any>,
  year: number,
}

export default withScriptjs(withGoogleMap(class LocationsMap extends Component<Props, {
  info: ?string,
}> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      info: null,
    }
  }


  render() {
    const y = this.props.year

    const defualt = {
      latitude: 33.9,
      longitude: 151.2,
      impact: 0,
    }

    const col = this.props.data.reduce((ac, cur) => {
      const loc = cur[1]
      const curImpact = loc.countImpact[y]

      const max = ac.max.impact < curImpact
        ? { impact: curImpact, latitude: loc.latitude, longitude: loc.longitude }
        : ac.max

      const min = ac.min.impact > curImpact
        ? { impact: curImpact, latitude: loc.latitude, longitude: loc.longitude }
        : ac.min

      return { min, max }
    }, { min: defualt, max: defualt })

    const scaledRadius = linear()
      .domain([col.min.impact, col.max.impact])
      .range([20000, 80000])


    declare var google: any
    const bounds = new google.maps.LatLngBounds()

    const padding = [3.5, -3.5]
    padding.forEach(offset => {
      bounds.extend({
        lat: col.max.latitude + offset,
        lng: col.max.longitude + offset,
      })
    })

    return (
      <GoogleMap
        ref={ ref => (!this.state.info && ref && ref.fitBounds(bounds)) }
        defaultOptions={ {
          styles: mapStyle,
          mapTypeControlOptions: {
            mapTypeIds: [],
          },
          streetViewControl: false,
        } }
      >
        <div>
          {
            this.props.data.map(loc => {
              const name = loc[0]
              const impact: {
                latitude: number,
                longitude: number,
                countImpact: Array<number>,
                count: number,
                compensationImpact: Array<number>,
              } = (loc[1]: any)

              return {
                center: {
                  lat: impact.latitude,
                  lng: impact.longitude,
                },
                radius: scaledRadius(impact.countImpact[y]),
                countImpact: impact.countImpact[y],
                compensationImpact: impact.compensationImpact[y],
                options: {
                  // eslint-disable-next-line css-modules/no-undef-class
                  fillColor: styles.primaryColor,
                  fillOpacity: 0.8,
                  // eslint-disable-next-line css-modules/no-undef-class
                  strokeColor: styles.primaryColor,
                  strokeOpacity: 1,
                  strokeWeight: 0,
                },

                onClick: () => this.setState({ info: name }),

              }
            }).map((marker, i) => {
              const key = `circle-${ i }`

              return (
                <Circle
                  key={ key }
                  { ...marker }
                />
              )
            })
          }

          <InfoTooltip
            name={ this.state.info }
            data={ this.props.data }
            year={ this.props.year }
            onCloseClick={ () => this.setState({ info: null }) }
          />
        </div>
      </GoogleMap>
    )
  }
}))
