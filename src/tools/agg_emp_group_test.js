
import { employeeGroup } from 'tandem/aggs'
import input from './input_complete.json'


const groups = employeeGroup(input.employeeData)

// eslint-disable-next-line no-console
console.log(JSON.stringify(groups, null, ' '))

// eslint-disable-next-line no-console
// console.log(parsed)
