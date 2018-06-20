import {
  flow,
  reduce,
  values,
} from 'lodash/fp'

import { unformat as parseMoney } from 'accounting'

import { employeeKeys as k } from './input'

// 3,6,8 (sum of TC), 9 (sum of (TC * RC)), 10, 11, 12, 13, 14, 15, 17, 18, 19

export const employeeGroupKeys = {
  gender: 0,
  roleName: 1,
  count: 2,
  sumTotalCompensation: 3,
  sumRedundancyCost: 4,
  SOCCode: 5,
  SOCName: 6,
  siteName: 7,
  businessUnit: 8,
  department: 9,
  street: 10,
  city: 11,
  state: 12,
  country: 13,
  postcode: 14,
  latitude: 15,
  longitude: 16,
}

export default function employeeGroup(employeeData) {
  function employeeGroupKey(emp, ...keys) {
    let key = ''
    keys.forEach(i => key += emp[i])

    return key
  }

  return flow(
    reduce(
      (emps, emp) => {
        const key = employeeGroupKey(
          emp,
          k.gender,
          k.SOCCode,
          k.siteName,
          k.businessUnit,
          k.department,
          k.street,
          k.city,
          k.state,
          k.country,
          k.postcode,
          k.latitude,
          k.longitude,
        )

        let group = emps[key]

        if (!group) {
          group = [
            emp[k.gender],
            emp[k.roleName],
            0,
            0.00, // sumTotalCompensation
            0.00, // sumRedundancyCost,
            emp[k.SOCCode],
            emp[k.SOCName],
            emp[k.siteName],
            emp[k.businessUnit],
            emp[k.department],
            emp[k.street],
            emp[k.city],
            emp[k.state],
            emp[k.country],
            emp[k.postcode],
            emp[k.latitude],
            emp[k.longitude],
          ]
        }

        const comp = parseMoney(emp[k.totalCompensation])

        group[employeeGroupKeys.sumTotalCompensation] += comp
        group[employeeGroupKeys.sumRedundancyCost] += ((emp[k.redundancyCost] / 100) * comp)
        group[employeeGroupKeys.count] += emp[k.count] || 1

        emps[key] = group


        return emps
      }, {},
    ),
    values,
  )(employeeData)
}
