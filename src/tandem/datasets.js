/* @flow */

export type DatasetMeta = {
  budgetImpact: {
    compImpact: number,
  },

  businessUnit: {
    unit: string,
    compImpact: number,
  },

  keyTechClass: {
    tech: string,
    compImpact: number,
  },

  humanCapImpact: {
    count: number,
    countImpact: number,
  },

  rolesImpact: {
    role: string,
    countImpact: number,
    count: number,
  },

  location: {
    state: string,
    countImpact: number,
  },

  industryIndex: number,
}

export type Dataset = {
  name: string,
  organizationId: string,
  employeeData: Array<any>,

  model: Array<any>,
  meta: DatasetMeta,

  createdAt: string,
}
