/* @flow */
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import {
  membershipTypes,
  type Organization,
  type Dataset,
} from 'tandem'

import BudgetImpact from './budget-impact'
import BusinessUnit from './business-unit'
import Dashboard from '../dashboard'
import KeyTechnologyClass from './key-technology-class'
import HumanCapitalImpact from './human-capital-impact'
import RolesImpacted from './roles-impacted'
import Location from './location'
import JobNeighbourhood from './job-neighbourhood'
import JobCorridor from './job-corridor'

export type Props = {
  organization: Organization,

  datasets: ?Array<Dataset>,
  getDatasets: (region: string, organizationId: string) => Promise<Array<Dataset>>

}

type State = {
  failed: boolean,
  redirect: boolean,
  loading: boolean,
}

export default class Reports extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      failed: false,
      redirect: false,
      loading: false,
    }
  }

  componentDidMount() {
    if (!this.props.datasets) {
      this.getDatasets()
    }
  }

  componentDidUpdate() {
    if (!this.props.datasets && !this.state.loading) {
      this.getDatasets()
    }
  }

  getDatasets() {
    if (!this.state.loading && !this.state.failed) {
      this.setState({ loading: true }, () => {
        this.props.getDatasets(
          this.props.organization.region,
          this.props.organization.id,
        ).then(
          datasets => {
            if (datasets.length) {
              this.setState({
                loading: false,
                redirect: false,
              })
            } else {
              this.setState({ redirect: true, loading: false })
            }
          },
          () => this.setState({ redirect: true, loading: false, failed: true }),
        )
      })
    }
  }

  render() {
    const organization = this.props.organization
    if (!organization) return null // wait for organization to load.

    if (this.state.failed) {
      return <p>failed to load your data</p>
    }


    if (this.state.loading || !this.props.datasets) {
      return <p>Please wait while we load your data...</p>
    }


    const { membershipType, slug } = organization

    if (
      this.state.redirect &&
      membershipType &&
      membershipType >= membershipTypes.admin
    ) {
      return <Redirect to={ `/${ slug }/file-upload` } />
    }

    if (this.state.redirect || !this.props.datasets || !this.props.datasets.length) {
      return <p>No data found.</p>
    }
    const dataset = this.props.datasets.slice(-1).pop()

    return (
      <Switch>
        <Route
          exact
          path='/:organizationSlug'
          render={ (props) => (
            <Dashboard { ...props } dataset={ dataset } organization={ organization } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/budget-impact'
          render={ (props) => (
            <BudgetImpact { ...props } dataset={ dataset } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/business-unit'
          render={ (props) => (
            <BusinessUnit { ...props } dataset={ dataset } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/key-technology-class'
          render={ (props) => (
            <KeyTechnologyClass
              { ...props }
              dataset={ dataset }
            />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/human-capital-impact'
          render={ (props) => (
            <HumanCapitalImpact
              { ...props }
              dataset={ dataset }
            />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/roles-impacted'
          render={ (props) => (
            <RolesImpacted { ...props } dataset={ dataset } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/location'
          render={ (props) => (
            <Location { ...props } dataset={ dataset } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/job-neighbourhood'
          render={ () => (
            <JobNeighbourhood dataset={ dataset } />
          ) }
        />

        <Route
          path='/:organizationSlug/reports/job-corridor'
          render={ () => (
            <JobCorridor
              dataset={ dataset }
            />
          ) }
        />

      </Switch>
    )
  }
}
