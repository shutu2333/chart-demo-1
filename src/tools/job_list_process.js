import { readFileSync } from 'fs'
import { parse } from 'papaparse'

import {
  flow,
  reduce,
  values,
} from 'lodash/fp'


const jobsPath =
  process.argv.length > 2
    ? process.argv[2]
    : './main_job_data.csv'


const rawJobs = readFileSync(jobsPath, 'utf-8')

const { data: jobs } = parse(rawJobs, {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
})

// Remove the header
jobs.shift()


// SOC-Code -> p
const Risks = jobs.reduce((rs, j) => {
  rs[j[4]] = j[8]

  return rs
}, {})


const altsPath =
  process.argv.length > 3
    ? process.argv[3]
    : './occuptions_alt.csv'


const altsRaw = readFileSync(altsPath, 'utf-8')

const { data: alts } = parse(altsRaw, {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
})

// Remove the header
alts.shift()

const parsed = flow(
  reduce(
    (as, o) => {
      const code = o[0]
      const name = o[1]
      const p = Risks[code]

      // XXX: find the average of group if no p exists.
      const names = (as[code] && as[code].alts) || []
      const longName = o[2]
      if (longName) {
        names.push(longName.toLowerCase())
      }

      const shortName = o[3]
      if (shortName) {
        names.push(shortName.toLowerCase())
      }

      as[code] = {
        p,
        code,
        name,
        alts: names,
      }

      return as
    }, {},
  ),
  values,
  reduce.convert({ 'cap': false })(
    (as, o, i) => { as[i] = o; return as },
    {},
  ),
)(alts)

process.stdout.write(JSON.stringify(parsed))
