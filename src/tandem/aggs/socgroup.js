import {
  flow,
  reduce,
  values,
} from 'lodash/fp'

// import { unformat as parseMoney } from 'accounting'

import { employeeGroupKeys as k } from './employeegroup'

export const socGroupKeys = {
  count: 0,
  sumTotalCompensation: 1,
  sumRedundancyCost: 2,
  SOCCode: 3,
  SOCName: 4,

  techs: 5,
}

export default function (model) {
  return function (employData) {
    return flow(
      reduce(
        (emps, eg) => {
          const key = eg[k.SOCCode]

          let group = emps[key]

          if (!group) {
            const socCode = eg[k.SOCCode]
            const mod = model[socCode]

            if (!mod) {
              return emps
            }

            group = [
              0,
              0.00, // sumTotalCompensation
              0.00, // sumRedundancyCost,
              socCode,
              eg[k.SOCName],
              mod.Techs,
            ]
          }

          // Expecting floats. So no parseMoney(eg[k.sumTotalCompensation])
          const comp = eg[k.sumTotalCompensation]

          group[socGroupKeys.sumTotalCompensation] += comp

          // XXX: This adds up to sumTotalCompensation. WTF?
          group[socGroupKeys.sumRedundancyCost] += eg[k.sumRedundancyCost]
          group[socGroupKeys.count] += eg[k.count]

          emps[key] = group


          return emps
        }, {},
      ),
      values,
    )(employData)
  }
}
