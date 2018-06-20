import {
  flow,
  map,
  filter,
  reduce,
} from 'lodash/fp'

import employeeGroup from './employeegroup'

import socGroup, {
  socGroupKeys,
} from './socgroup'

import { employeeKeys } from './input'

import { makeAgeFilter } from './filters'

const calcSocGroupCompensationImpact = o => map(s => {
  const sg = s.concat()

  const comp = sg[socGroupKeys.sumTotalCompensation]

  const techs = sg[socGroupKeys.techs]
  const techsImpact = {}

  Object.keys(techs).forEach(tech => {
    techsImpact[tech] = {
      ...techs[tech],
      Curve: techs[tech].Curve.map(prob => prob * comp),
    }
  })

  sg[socGroupKeys.techs] = techsImpact

  return sg
})(o)

const totalImpact = o => reduce((ti, sg) => {
  const techs = sg[socGroupKeys.techs]

  Object.keys(techs).forEach(tech => {
    const total = ti[tech] || {}

    techs[tech].Curve.forEach((v, i) => {
      const y = i + 1
      total[y] = (total[y] || 0) + v
    })
    ti[tech] = total
  })
  return ti
}, {})(o)

export default function techImpact(model, filters) {
  return function (employees) {
    return flow(
      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.businessUnit]) > -1
      })(filters.businessUnit)),

      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.state]) > -1
      })(filters.location)),

      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.department]) > -1
      })(filters.department)),


      filter(makeAgeFilter(filters.age)),

      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.employeeLevel]) > -1
      })(filters.employeeLevel)),

      employeeGroup,
      socGroup(model),
      calcSocGroupCompensationImpact,
      totalImpact,
    )(employees)
  }
}
