import {
  filter,
} from 'lodash/fp'

import { employeeKeys } from 'tandem/aggs'
import input from './input_with_soc_code_geocode.json'

import model from '../api/services/ai/impact_model.json'

const hasGoodSOC = e => { const code = e[employeeKeys.SOCCode]; return code && model[code] }

const parsed = {
  ...input,
  employeeData: filter(hasGoodSOC)(input.employee_data),
}

// eslint-disable-next-line no-console
console.log(JSON.stringify(parsed, null, ' '))
