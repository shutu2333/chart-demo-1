import { assign } from 'lodash'
import styles from './styles.scss'

// *
// * Colors
// *

// colors[4] = '#626c88'

export const colors = [
  styles.primaryColor, // eslint-disable-line css-modules/no-undef-class
  styles.lightOrange, // eslint-disable-line css-modules/no-undef-class
  styles.lightGray2, // eslint-disable-line css-modules/no-undef-class
  '#626c88', // styles.lighterGray, // eslint-disable-line css-modules/no-undef-class
  styles.darkishGray, // eslint-disable-line css-modules/no-undef-class

  styles.primaryColor_1, // eslint-disable-line css-modules/no-undef-class
  styles.lightOrange_1, // eslint-disable-line css-modules/no-undef-class
  styles.lightGray2_1, // eslint-disable-line css-modules/no-undef-class
  styles.lighterGray_1, // eslint-disable-line css-modules/no-undef-class
  styles.darkishGray_1, // eslint-disable-line css-modules/no-undef-class

  styles.primaryColor_2, // eslint-disable-line css-modules/no-undef-class
  styles.lightOrange_2, // eslint-disable-line css-modules/no-undef-class
  styles.lightGray2_2, // eslint-disable-line css-modules/no-undef-class
  styles.lighterGray_2, // eslint-disable-line css-modules/no-undef-class
  // styles.darkishGray_2, // eslint-disable-line css-modules/no-undef-class

  styles.primaryColor_3, // eslint-disable-line css-modules/no-undef-class
  styles.lightOrange_3, // eslint-disable-line css-modules/no-undef-class
  styles.lightGray2_3, // eslint-disable-line css-modules/no-undef-class
  styles.lighterGray_3, // eslint-disable-line css-modules/no-undef-class
  styles.darkishGray_3, // eslint-disable-line css-modules/no-undef-class

  styles.primaryColor_4, // eslint-disable-line css-modules/no-undef-class
  styles.lightOrange_4, // eslint-disable-line css-modules/no-undef-class
  styles.primaryColor_5, // eslint-disable-line css-modules/no-undef-class
]

const blueGrey10 = 'rgba(255, 255, 255, 0.2)'
const blueGrey50 = '#ECEFF1'
const blueGrey300 = '#90A4AE'
const blueGrey700 = '#455A64'
const grey900 = '#212121'
// *
// * Typography
// *
const sansSerif = "'Roboto', 'Helvetica Neue', Helvetica, sans-serif"
const letterSpacing = 'normal'
const fontSize = 17
// *
// * Layout
// *
const padding = 8
const baseProps = {
  width: 900,
  height: 650,
  padding: 0,
}
// *
// * Labels
// *
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding,
  fill: styles.lighterGray, // eslint-disable-line css-modules/no-undef-class
  stroke: 'transparent',
  strokeWidth: 0,
}

const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles)
// *
// * Strokes
// *
const strokeDasharray = '10, 0'
const strokeLinecap = 'round'
const strokeLinejoin = 'round'

export default {
  area: assign({
    style: {
      data: {
        fill: grey900,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  axis: assign({
    style: {
      axis: {
        fill: 'transparent',
        stroke: blueGrey300,
        strokeWidth: 2,
        strokeLinecap,
        strokeLinejoin,
      },
      axisLabel: assign({}, centeredLabelStyles, {
        padding,
        stroke: 'transparent',
      }),
      grid: {
        fill: 'transparent',
        stroke: blueGrey10,
        strokeDasharray,
        strokeLinecap,
        strokeLinejoin,
        pointerEvents: 'none',
      },
      ticks: {
        fill: 'transparent',
        size: 5,
        stroke: blueGrey300,
        strokeWidth: 1,
        strokeLinecap,
        strokeLinejoin,
      },
      tickLabels: assign({}, baseLabelStyles, {
        fill: '#FFF',
      }),
    },
  }, baseProps),
  bar: assign({
    style: {
      data: {
        fill: blueGrey700,
        padding,
        strokeWidth: 0,
      },
      labels: baseLabelStyles,
    },
  }, baseProps),
  candlestick: assign({
    style: {
      data: {
        stroke: blueGrey700,
      },
      labels: centeredLabelStyles,
    },
    candleColors: {
      positive: '#ffffff',
      negative: blueGrey700,
    },
  }, baseProps),
  chart: baseProps,
  errorbar: assign({
    style: {
      data: {
        fill: 'transparent',
        opacity: 1,
        stroke: blueGrey700,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  group: assign({
    colorScale: colors,
  }, baseProps),
  line: assign({
    style: {
      data: {
        fill: 'transparent',
        opacity: 1,
        stroke: blueGrey700,
        strokeWidth: 2,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  pie: assign({
    colorScale: colors,
    style: {
      data: {
        padding,
        stroke: blueGrey50,
        strokeWidth: 1,
      },
      labels: assign({}, baseLabelStyles, { padding: 20 }),
    },
  }, baseProps),
  scatter: assign({
    style: {
      data: {
        fill: blueGrey700,
        opacity: 1,
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: centeredLabelStyles,
    },
  }, baseProps),
  stack: assign({
    colorScale: colors,
  }, baseProps),
  tooltip: {
    style: assign({}, centeredLabelStyles, { padding: 5, pointerEvents: 'none' }),
    flyoutStyle: {
      stroke: grey900,
      strokeWidth: 0,
      fill: '#ffffff',
      pointerEvents: 'none',
    },
    cornerRadius: 0,
    pointerLength: 5,
  },
  voronoi: assign({
    style: {
      data: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      },
      labels: assign({}, centeredLabelStyles, { padding: 5, pointerEvents: 'none' }),
      flyout: {
        stroke: grey900,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none',
      },
    },
  }, baseProps),
  legend: {
    colorScale: colors,
    gutter: 10,
    orientation: 'vertical',
    style: {
      data: {
        type: 'circle',
      },
      labels: baseLabelStyles,
    },
    symbolSpacer: 8,
  },
}
