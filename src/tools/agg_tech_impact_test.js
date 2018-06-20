/* @flow */
import {
  flow,
} from 'lodash/fp'


import {
  techImpact,
} from 'tandem/aggs'

import input from './input_complete.json'

import model from '../api/services/ai/impact_model.json'

const agged = flow(
  techImpact(model),
)(input.employeeData)

// eslint-disable-next-line no-console
console.log(JSON.stringify(agged, null, ' '))
