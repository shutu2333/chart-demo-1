/* @flow */

import {
  flow,
  groupBy,
  reduce,
  mapValues,
  values,
  entries,
  filter,
  map,
  pickBy,
} from 'lodash/fp'

import { employeeKeys } from './input'

import { makeAgeFilter, type AgeRange } from './filters'

import employeeGroup,
{ employeeGroupKeys as k } from './employeegroup'

export const socGroupKeys = {
  count: 0,
  sumTotalCompensation: 1,
  sumRedundancyCost: 2,
  SOCCode: 3,
  SOCName: 4,
  techs: 5,
  latitude: 6,
  longitude: 7,
}

function socGroup(model) {
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
              // console.log(`Missing model: ${ socCode } ${ eg[k.SOCName] }`)
              return emps
            }

            group = [
              0,
              0.00, // sumTotalCompensation
              0.00, // sumRedundancyCost,
              socCode,
              eg[k.SOCName],
              mod.Techs,
              eg[k.latitude],
              eg[k.longitude],
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

export function groupBudgetImpact(techsFilter: (string) => boolean) {
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

        latitude: sg[socGroupKeys.latitude],
        longitude: sg[socGroupKeys.longitude],
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


function flattenGroupImpact(o: *) {
  return reduce((org, sgi) => {
    org.count += sgi.count
    org.sumTotalCompensation += sgi.sumTotalCompensation

    org.latitude = sgi.latitude
    org.longitude = sgi.longitude

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
    latitude: 0,
    longitude: 0,
  })(o)
}

type filters = {
  businessUnit: Array<{ value: string }>,
  age: Array<AgeRange>,
  department: Array<{ value: string }>,
  employeeLevel: Array<{ value: string }>,
  techs: Array<{ value: string }>,
}

export default function locImpact(model: *, f: filters) {
  return function (employees: *) {
    return flow(
      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.businessUnit]) > -1
      })(f.businessUnit)),

      filter(makeAgeFilter(f.age)),

      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.department]) > -1
      })(f.department)),

      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.employeeLevel]) > -1
      })(f.employeeLevel)),

      groupBy(e => e[employeeKeys.state]),
      pickBy((_, state: string) => state && state !== 'null'),
      mapValues(org => flow(employeeGroup, socGroup(model))(org)),
      mapValues(groupBudgetImpact((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (tech) => selectorValues.indexOf(tech) > -1
      })(f.techs))),
      mapValues(flattenGroupImpact),
    )(employees)
  }
}
