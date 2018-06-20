/* @flow */
import {
  flow,
  entries,
  map,
  filter,
  reduce,
} from 'lodash/fp'


import {
  socGroupKeys,
} from './socgroup'


export default function groupBudgetImpact(techsFilter: (string) => boolean) {
  return function (o: *) {
    return reduce((org, sg) => {
      const socCode = sg[socGroupKeys.SOCCode]
      const count = sg[socGroupKeys.count]
      const sumComp = sg[socGroupKeys.sumTotalCompensation]

      const groupImpact = {
        count,
        sumTotalCompensation: sumComp,
        compensationImpact: new Array(16).fill(0),
        countImpact: new Array(16).fill(0),

        SOCCode: socCode,
        SOCName: sg[socGroupKeys.SOCName],
      }

      groupImpact.compensationImpact.forEach((_, y) => {
        const techsImpactProb = flow(
          entries,
          filter(i => techsFilter(i[0])),
          map(t => t[1].Curve[y]),
          reduce((s, i) => s + i, 0),
        )(sg[socGroupKeys.techs])

        const socCompImpact = (sumComp * techsImpactProb)
        const socCountImpact = (count * techsImpactProb)

        groupImpact.compensationImpact[y] += socCompImpact
        groupImpact.countImpact[y] += socCountImpact
      })

      org[socCode] = groupImpact
      return org
    }, {})(o)
  }
}

export function flattenGroupImpact(o: *) {
  return reduce((org, sgi) => {
    org.count += sgi.count

    org.sumTotalCompensation += sgi.sumTotalCompensation

    org.compensationImpact.forEach((_, y) => {
      org.compensationImpact[y] += sgi.compensationImpact[y]
      org.countImpact[y] += sgi.countImpact[y]
    })

    return org
  }, {
    count: 0,
    sumTotalCompensation: 0,
    compensationImpact: new Array(16).fill(0),
    countImpact: new Array(16).fill(0),
  })(o)
}
