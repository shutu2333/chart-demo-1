/* @flow */

export { default as slug } from './slug'
export { default as regions } from './regions'

export { Dataset } from './datasets'
export {
  Job,
  JobDistance,
  JobElement,
} from './jobs'

export const organizationTypes = {
  umbrella: 'umbrella',
  consultancy: 'consultancy',
  client: 'client',
}

export type OrganizationType = $Keys<typeof organizationTypes>

export const membershipTypes = {
  basic: 1,
  admin: 10,
  superadmin: 20,
}
export type MembershipType = $Values<typeof membershipTypes>
export type MembershipLabel = $Keys<typeof membershipTypes>


export const membershipLabels: { [MembershipType]: MembershipLabel } =
    Object.entries(membershipTypes)
      .reduce((names, e: any) => { names[e[1]] = e[0]; return names }, {})

export type Organization = {
  id: string,
  region: string,
  name: string,
  slug: string,
  type: OrganizationType,
  country: string,
  industry: string,
  registrationType: string,
  registrationNumber: string,
  domainName: string,
  active: boolean,
  parentId: ?string,


  // used for frontend.
  membershipType?: MembershipType,
}

export type User = {
  id: string,
  // createdAt?: Date,
  // updatedAt?: Date,

  email: string,
  firstName: string,
  lastName: string,

  active: boolean,

  // relative to current organization.
  membershipType?: MembershipType,
  membershipActive?: boolean,
}


export type Membership = {
  id: string,
  userId: string,
  organizationId: string,
  active: boolean,
  type: MembershipType,
}

export type Credentials = {
  email: string,
  password: string,
}


export type Company = {
  id: string,
  name: string,
  createdAt: Date,
  updatedAt: Date,
}

export type Reports = {
  id: string,
  company: string,
}
