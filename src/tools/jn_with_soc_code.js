import {
  // flow,
  map,
  // mapValues,
  reduce,
} from 'lodash/fp'

import jn from './job_neighbourhood.json'
import occuptions from './occuptaions.json'


const jnKeys = {
  SOCCode: 0,
  SOCName: 1,
  segment: 2,
  x: 3,
  y: 4,
  p: 5,
}

const Codes = reduce((set, o) => { return { ...set, [o[1]]: o[0] } }, {})(occuptions)

const withCode = map(x => {
  x[jnKeys.SOCCode] = Codes[x[jnKeys.SOCName]]

  x[jnKeys.x] = parseFloat(x[jnKeys.x].toFixed(3), 10) * 1000
  x[jnKeys.y] = parseFloat(x[jnKeys.y].toFixed(3), 10) * 1000
  return x
})

const parsed = withCode(jn)

// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))

// eslint-disable-next-line no-console
// console.log(parsed)
