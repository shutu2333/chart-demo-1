import {
  // flow,
  map,
  // mapValues,
  reduce,
} from 'lodash/fp'

import input from './input.json'
import occuptions from './occuptaions.json'


const Codes = reduce((set, o) => { return { ...set, [o[1]]: o[0] } }, {})(occuptions)

const withCode = map(x => {
  x[10] = Codes[x[6]]
  x[11] = x[6]

  return x
})

const parsed = {
  ...input,
  employeeData: withCode(input.employee_data),
}


// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))

// eslint-disable-next-line no-console
// console.log(parsed)
