/* @flow */
// import { intword as HumanNumber } from 'humanize-plus'

import {
  flow,
  map,
  sortBy,
  entries,
} from 'lodash/fp'

// import { techImpact, employeeKeys } from 'tandem/aggs'

import { type DropdownOptions as Options } from 'ui'

export const keyTechDisplayName: { [string]: string } = {
  Social_AI: 'Social AI',
  Process_AI: 'Process AI',
  Mobile_Robotics: 'Mobile Robotics',
  In_Place_Robotics: 'Fixed Robotics',
  Materials: 'Advanced Materials',
}

export const keyTechFilterOptions = (
  (
    flow(
      entries,
      map(kv => {
        const value: string = kv[0]
        const label: string = (kv[1]: any)
        return { value, label }
      }),
      sortBy(i => i.label),
    )(keyTechDisplayName)
  ): Options
)

