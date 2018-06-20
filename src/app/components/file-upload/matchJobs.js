/* @flow */

import type {
  Job,
} from 'tandem'

import { employeeKeys } from 'tandem/aggs/input'

import { type DatasetInput } from '../../factors/datasets'

const matchJobs = (datasetInput: DatasetInput, jobList: Array<Job>) => {
  const socTable = jobList.reduce((t, j) => {
    t[j.code] = j.name
    return t
  }, {})

  const nameTable = jobList.reduce((t, j) => {
    t[j.name.toLocaleLowerCase()] = j.code
    return t
  }, {})

  return datasetInput.employeeData.reduce((result, job: any) => {
    const SOCCode = job[employeeKeys.SOCCode]
    const SOCName = job[employeeKeys.SOCName]
    const roleName = job[employeeKeys.roleName]

    // check for match in SOCCode
    if (SOCCode) {
      const foundSocName = socTable[SOCCode]
      if (foundSocName) {
        job[employeeKeys.SOCName] = foundSocName
        result.valid.push(job)
      } else {
        result.invalid.socCodes[SOCCode] = result.invalid.socCodes[SOCCode] + 1 || 1
      }

      return result
    }

    // check for match in SOCName
    if (SOCName) {
      const foundSocCode = nameTable[SOCName.toLocaleLowerCase()]
      if (foundSocCode) {
        job[employeeKeys.SOCCode] = foundSocCode
        result.valid.push(job)
      } else {
        result.invalid.roleNames[SOCName] = result.invalid.roleNames[SOCName] + 1 || 1
      }
      return result
    }

    // check for match in roleName
    if (roleName) {
      const foundSocCode = nameTable[roleName.toLowerCase()]
      if (foundSocCode) {
        job[employeeKeys.SOCCode] = foundSocCode
        job[employeeKeys.SOCName] = socTable[foundSocCode]
        result.valid.push(job)
      } else {
        result.notMatched.push(roleName)
        result.valid.push(job)
      }

      return result
    }

    // all 3 fields were missing, impossible to match
    result.invalid.unknown = result.invalid.unknown + 1 || 1

    return result
  }, { notMatched: [], valid: [], invalid: { socCodes: {}, roleNames: {}, unknown: 0 } })
}

export default matchJobs
