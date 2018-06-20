import {
  flow,
  reduce,
  values,
} from 'lodash/fp'

import { employeeGroupKeys as k } from './employeegroup'

export const orgGroupKeys = {
  businessUnit: 0,
  count: 1,

  sumOfCompImpact: 3,
  sumOfNumberImpact: 4,
}

export default function () {
  return function (egs) {
    return flow(
      reduce(
        (bus, eg) => {
          const unitName = eg[k.businessUnit]

          let bu = bus[unitName]

          if (!bu) {
            bu = [
              unitName,
              0,
              0,
              new Array(16).fill(0),
              new Array(16).fill(0),
            ]
          }

          bu[orgGroupKeys.count] += eg[k.count]

          // const egComp = eg[k.sumTotalCompensation]

          // const techImpact = Object.values(model[egs[k.SOCCode]].Techs)


          bus[unitName] = bu


          return bus
        }, {},
      ),
      values,
    )(egs)
  }
}
