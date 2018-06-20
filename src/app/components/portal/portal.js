/* @flow */

import React, { Component } from 'react'
import {
  Route,
  Switch,
  Redirect,
  type Match,
  type Location,
  type ContextRouter,
} from 'react-router-dom'

import type { Organization } from 'tandem'

import Overlay from './Overlay'
import OrganizationPrompt from './OrganizationPrompt'
import Sidebar from '../layout/Sidebar'

import FileUpload from '../file-upload'
import Reports from '../reports'
import Manage from '../manage'

import styles from './styles.scss'

export type Props = {
  match: Match,
  location: Location,
  organizations: Array<Organization>,
  GetUserOrganizations: () => Promise<Array<Organization>>,
  loading: number,
}

export default class Portal extends Component<Props> {
  static defaultProps = {}

  componentDidMount() {
    if (!this.props.organizations) {
      this.props.GetUserOrganizations()
    }
  }

  render() {
    const organizations = this.props.organizations

    if (!organizations || !organizations.length) {
      return null
    }

    const { organizationSlug } = this.props.match.params
    const { showOrganizationPrompt } = this.props.location.state || {}

    const organization: ?Organization = organizationSlug
      ? this.props.organizations.find(e => e.slug === organizationSlug)
      : null

    if (organizationSlug && !organization) {
      // TODO: throw not found prompt?
      return (<Redirect to='/' />)
    }


    const { length: orgCount } = this.props.organizations || []


    if (!organizationSlug && !showOrganizationPrompt && orgCount === 1) {
      return (
        <Redirect
          to={ `/${ this.props.organizations[0].slug }` }
        />
      )
    }

    const mustShowOrganizationPrompt = (!organizationSlug || showOrganizationPrompt) && !!orgCount

    return (
      <div className={ styles.portal } >

        <Overlay
          showOverlay={ mustShowOrganizationPrompt || this.props.loading > 0 }
        />

        <Sidebar
          organizations={ this.props.organizations || [] }
          currentOrganization={ organizationSlug }
        />

        { mustShowOrganizationPrompt
          ? <OrganizationPrompt organizations={ this.props.organizations || [] } />
          : null
        }

        {
          organization
          ? (
            <Switch>
              <Route
                path='/:organizationSlug/file-upload'
                component={ FileUpload }
              />
              <Route
                path='/:organizationSlug/manage'
                render={ (props: ContextRouter) => (
                  <Manage { ...props } organization={ organization } />
                ) }
              />
              <Route
                path='/:organizationSlug'
                render={ (/* props: ContextRouter */) => (
                  <Reports organization={ organization } />
                ) }
              />
            </Switch>
          )
          : null
        }

      </div>
    )
  }
}
