import {
  flow,
  map,
  mapValues,
  reduce,
} from 'lodash/fp'

import model from './model_raw.json'
import occuptions from './occuptaions.json'


const Codes = reduce((set, o) => { return { ...set, [o[1]]: o[0] } }, {})(occuptions)

const withCode = map(x => { x.Code = Codes[x.Title]; return x })

const groupByCode = reduce((set, o) => {
  return { ...set, [o.Code]: [...(set[o.Code] || []), o] }
}, {})


const copyMeta = mapValues(x => { return { Code: x[0].Code, Title: x[0].Title, Techs: x } })

const formatTechs = mapValues(x => {
  return {
    Title: x.Title,
    Techs: reduce((ts, t) => {
      return {
        ...ts,
        [t.Tech]: {
          P: t.P,
          Weight: t.Weight,
          Curve: [
            t['0'],
            t['1'],
            t['2'],
            t['3'],
            t['4'],
            t['5'],
            t['6'],
            t['7'],
            t['8'],
            t['9'],
            t['10'],
            t['11'],
            t['12'],
            t['13'],
            t['14'],
            t['15'],
          ],
        },
      }
    }, {})(x.Techs),
  }
})


const parsed = flow(
  withCode,
  groupByCode,
  copyMeta,
  formatTechs,
)(model)


// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))

// eslint-disable-next-line no-console
// console.log(parsed)
