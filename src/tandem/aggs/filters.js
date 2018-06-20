/* @flow */

import { range } from 'lodash/fp'

import { employeeKeys } from './input'

const maxPossibleAge = 999

const unspecifiedRange = {
  value: { min: 0, max: 0 }, // not used anywhere, just to avoid an if condition for flow.
  label: 'Unspecified',
}


export type AgeRange = {
  value: {
    min: number,
    max: number,
  },
  label: string,
}


const ageRanges = [
  { min: 0, max: 24 },
  { min: 25, max: 34 },
  { min: 35, max: 44 },
  { min: 45, max: 54 },
  { min: 55, max: 64 },
  { min: 65, max: maxPossibleAge },
].map(
  value => ({
    value,
    label: value.max === maxPossibleAge
      ? `${ value.min }+`
      : `${ value.min } - ${ value.max }`,
  }),
).concat([
  unspecifiedRange,
])


function isBetweenInclusive(num: number, min: number, max: number): boolean {
  return num >= min && num <= max
}

export function validAge(rawAge: number | string | null) {
  const age = parseFloat(rawAge)

  if (Number.isNaN(age)) return false
  if (age < 0) return false
  if (age > maxPossibleAge) return false
  return true
}

export default function findAgeRange(age: number) {
  if (!validAge(age)) return unspecifiedRange
  return ageRanges.find(r => isBetweenInclusive(age, r.value.min, r.value.max))
}


export function makeAgeFilter(selector: Array<AgeRange>) {
  if (!selector.length) { return () => true }
  const selectorValues = selector.reduce((allAges, i) => {
    // expand the min-max range and add to allAges array
    if (i.value.unspecified) return allAges
    return allAges.concat(range(i.value.min, i.value.max + 1))
  }, [])

  const allowUnspecified = selector.findIndex(r => r.label === 'Unspecified') > -1

  return (e: *) => {
    const age = e[employeeKeys.age]
    return validAge(age) ? selectorValues.indexOf(e[employeeKeys.age]) > -1 : allowUnspecified
  }
}
