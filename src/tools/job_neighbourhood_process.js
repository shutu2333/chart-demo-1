import {
  flow,
  map,
  reduce,
} from 'lodash/fp'

import { parse } from 'papaparse'

import occuptions from './occuptaions.json'
import raw from './job_neighbourhood_input.csv'

const Codes = reduce((set, o) => { return { ...set, [o[1]]: o[0] } }, {})(occuptions)


const source = parse(raw, {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
})

// Remove the header
source.data.shift()

// input keys
const ik = {
  title: 0,
  x: 1,
  y: 2,
  p: 3,
  label: 4,
  segment: 5,
  y0: 6,
  y1: 7,
  y2: 8,
  y3: 9,
  y4: 10,
  y5: 11,
  y6: 12,
  y7: 13,
  y8: 14,
  y9: 15,
  y10: 16,
  y11: 17,
  y12: 18,
  y13: 19,
  y14: 20,
  y15: 21,
}

// keys
const k = {
  SOCCode: 0,
  SOCName: 1,
  segment: 2,
  x: 3,
  y: 4,
  p: 5,
}

const Transform = map(e => [
  Codes[e[ik.title]],
  e[ik.title],
  e[ik.label],
  e[ik.x],
  e[ik.y],
  e[ik.y5],
])

const jobs = flow(
  Transform,
)(source.data)

const segmentParts = new RegExp('(\\d+)\\.\\s(.*)$')

const labels = reduce((l, j) => ({
  ...l,
  [j[ik.label]]: j[ik.segment].replace(segmentParts, (_, _1, name) => name),
}), {})(source.data)


const bounds = reduce((b, e) => ({
  x: [
    Math.floor(Math.min(b.x[0], e[k.x])),
    Math.ceil(Math.max(b.x[1], e[k.x])),
  ],
  y: [
    Math.floor(Math.min(b.y[0], e[k.y])),
    Math.ceil(Math.max(b.y[1], e[k.y])),
  ],
}), { x: [0, 0], y: [0, 0] })(jobs)

const parsed = {
  jobs,
  meta: {
    // bounds,
    labels,
    domain: [
      Math.floor(Math.min(bounds.x[0], bounds.y[0])),
      Math.ceil(Math.max(bounds.x[1], bounds.y[1])),
    ],
  },
}
// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))
