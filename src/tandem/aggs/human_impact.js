/* @flow */

import {
  flow,
  groupBy,
  mapValues,
  pickBy,
  filter,
} from 'lodash/fp'

import {
  employeeKeys,
} from './input'

import { makeAgeFilter, type AgeRange } from './filters'

import socGroup from './socgroup'

import employeeGroup, { employeeGroupKeys } from './employeegroup'

import groupImpact, { flattenGroupImpact } from './groupimpact'

type filters = {
  businessUnit: Array<{ value: string }>,
  location: Array<{ value: string }>,
  age: Array<AgeRange>,
  department: Array<{ value: string }>,
  employeeLevel: Array<{ value: string }>,
  techs: Array<{ value: string }>,
}

export default function humanImpact(model: *, f: filters) {
  return function (employees: *) {
    return flow(
      filter((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (e) => selectorValues.indexOf(e[employeeKeys.state]) > -1
      })(f.location)),

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

      groupBy(employeeKeys.businessUnit),

      pickBy((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (_, bu: string) => selectorValues.indexOf(bu) > -1
      })(f.businessUnit)),

      mapValues(employeeGroup),
      mapValues(groupBy(employeeGroupKeys.gender)),
      mapValues(mapValues(flow(
        socGroup(model),
        groupImpact((selector => {
          if (!selector.length) { return () => true }
          const selectorValues = selector.map(i => i.value)
          return (tech) => selectorValues.indexOf(tech) > -1
        })(f.techs)),
        flattenGroupImpact,
      ))),
    )(employees)
  }
}
