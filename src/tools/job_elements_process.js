import { readFileSync } from 'fs'

import { parse } from 'papaparse'

import {
  flow,
  map,
  // filter,
} from 'lodash/fp'


const path =
  process.argv.length > 2
    ? process.argv[2]
    : './main_job_data.csv'

const raw = readFileSync(path, 'utf-8')


const { data: distances } = parse(raw, {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
})

// Remove the header
distances.shift()

const k = {
  index: 0,
  Title: 1,
  ElementType: 2,
  ElementName: 3,
  SOCCode: 4,
  ElementID: 5,
  DataValue: 6,
  Code: 7,
  p: 8,
}

const parsed = flow(
  map(d => ({
    soc: d[k.SOCCode],
    code: d[k.ElementID],
    type: d[k.ElementType],
    name: d[k.ElementName],
    value: d[k.DataValue],
  })),
  // filter(d => d.value > 0.1),
)(distances)

process.stdout.write(JSON.stringify(parsed, null, ' '))
