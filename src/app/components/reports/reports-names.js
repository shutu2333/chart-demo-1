/* @flow */

type reportList = {
  budgetImpact: string,
  businessUnit: string,
  keyTechnologyClass: string,
  humanCapitalImpact: string,
  rolesImpacted: string,
  location: string,
}

export const reportsTitle: reportList = {
  budgetImpact: 'Budget Impact',
  businessUnit: 'Business Unit Prioritisation',
  keyTechnologyClass: 'Key Technology',
  humanCapitalImpact: 'Human Capital Impact',
  rolesImpacted: 'Roles Impacted',
  location: 'Location',
}

export const reportsRoute = {
  'Budget Impact': 'budget-impact',
  'Business Unit Prioritisation': 'business-unit',
  'Key Technology': 'key-technology-class',
  'Human Capital Impact': 'human-capital-impact',
  'Roles Impacted': 'roles-impacted',
  'Location': 'location',
}

export function reportRoute(projectSlug: string, reportName: string) {
  return `/${ projectSlug }/reports/${ reportsRoute[reportName] }`
}
