/* @flow */

import {
  flow,
  groupBy,
  mapValues,
  mapKeys,
  pickBy,
  filter,
} from 'lodash/fp'


import {
  employeeKeys,
} from './input'

import socGroup from './socgroup'

import employeeGroup from './employeegroup'

import groupImpact, { flattenGroupImpact } from './groupimpact'

import { makeAgeFilter, type AgeRange } from './filters'

type filters = {
  businessUnit: Array<{ value: string }>,
  location: Array<{ value: string }>,
  age: Array<AgeRange>,
  department: Array<{ value: string }>,
  employeeLevel: Array<{ value: string }>,
  techs: Array<{ value: string }>,
}


export default function budgetImpact(model: *, f: filters) {
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
      mapKeys(k => (k === 'null' ? 'Unspecified' : k)),
      pickBy((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (_, bu: string) => selectorValues.indexOf(bu) > -1
      })(f.businessUnit)),

      mapValues(flow(employeeGroup, socGroup(model))),
      mapValues(groupImpact((selector => {
        if (!selector.length) { return () => true }
        const selectorValues = selector.map(i => i.value)
        return (tech) => selectorValues.indexOf(tech) > -1
      })(f.techs))),

      mapValues(flattenGroupImpact),
    )(employees)
  }
}
