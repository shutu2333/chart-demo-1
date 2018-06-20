import { readFileSync } from 'fs'

import { parse } from 'papaparse'

import {
  flow,
  map,
  filter,
  sortBy,
  groupBy,
  values,
  flatten,
} from 'lodash/fp'


import occuptions from './occuptaions.json'

const Codes = occuptions.reduce(
  (set, o) => { set[o[1]] = o[0]; return set },
  {},
)

const jobDistancePath =
  process.argv.length > 2
    ? process.argv[2]
    : './job_distance_long_t.csv'


const rawJobDistance = readFileSync(jobDistancePath, 'utf-8')

const { data: distances } = parse(rawJobDistance, {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
})

// Remove the header
distances.shift()


const parsed = flow(
  filter(d => d[1] !== d[2]),
  // filter(d => d[3] <= 1.8),
  groupBy(d => d[1]), // group based on from
  values,
  map(dg => dg.sort((a, b) => a[3] - b[3]).slice(0, 51)),
  flatten,
  map(d => ({
    from: Codes[d[2]],
    to: Codes[d[1]],
    distance: d[3],
  })),
  sortBy([0, 1]),
)(distances)

process.stdout.write(JSON.stringify(parsed))
