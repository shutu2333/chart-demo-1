/* @flow */
import React, { Component } from 'react'
import { Flex } from 'ui'
import { intword as HumanNumber } from 'humanize-plus'
import { format as formatDate } from 'date-fns'
import fs from 'file-saver'

import type {
  Dataset,
  Organization,
} from 'tandem'

import Tile from './tile'

import { reportsTitle } from '../reports/reports-names'


import BudgetImpactIcon from '../../assets/img/dashboard/BudgetImpact.svg'
import BusinessUnitIcon from '../../assets/img/dashboard/BusinessUnit.svg'
import LocationIcon from '../../assets/img/dashboard/Location.svg'
import KeyTechnologyClassIcon from '../../assets/img/dashboard/KeyTechnologyClass.svg'
import RolesIcon from '../../assets/img/dashboard/Roles.svg'
import HumanIcon from '../../assets/img/dashboard/Human.svg'

import styles from './styles.scss'

import { keyTechDisplayName } from '../reports/keyTechMeta'

export type Props = {
  dataset: Dataset,
  organization: Organization,
}

export type State = {}

export default class Dashboard extends Component<Props, State> {
  downloadMeta() {
    fs.saveAs(
      new Blob([JSON.stringify(this.props.dataset.meta, null, 2)], { type: 'text/plain;charset=utf-8' }),
      `${ this.props.organization.slug }.txt`,
    )
  }

  render() {
    const meta = this.props.dataset.meta
    const { slug, name } = this.props.organization

    return (
      <Flex flexDirection='column'>
        <h5 className={ styles.organization }>
          <span>{ name }</span> as {
            formatDate(new Date(this.props.dataset.createdAt), 'DD MMMM YYYY, hh:mm A')
          }
        </h5>

        <Flex
          className={ styles.header }
          flexDirection='row'
          alignItems='center'
          alignContent='space-between'
        >
          <h3>Technology Automation Roadmap</h3>
          <h5>All results as of year 5.</h5>
        </Flex>
        <Flex flexDirection='row'>
          <Tile
            url={ `/${ slug }/reports/budget-impact` }
            text={
              meta.budgetImpact
                ? `$${ HumanNumber(meta.budgetImpact.compImpact, ' ', 2) }`
                : '-'
            }
            icon={ BudgetImpactIcon }
            title={ reportsTitle.budgetImpact }
          />
          <Tile
            url={ `/${ slug }/reports/business-unit` }
            text={
              meta.businessUnit
                ? `${ meta.businessUnit.unit } ${ HumanNumber(meta.businessUnit.compImpact, ' ', 2) }`
                : '-'
            }
            icon={ BusinessUnitIcon }
            title={ reportsTitle.businessUnit }
          />
          <Tile
            url={ `/${ slug }/reports/key-technology-class` }
            text={
              meta.keyTechClass
                ? `${ keyTechDisplayName[meta.keyTechClass.tech] } ${ HumanNumber(meta.keyTechClass.compImpact, ' ', 2) }`
                : '-'
            }
            icon={ KeyTechnologyClassIcon }
            title={ reportsTitle.keyTechnologyClass }
          />
        </Flex>

        <h3>People Impact</h3>
        <Flex flexDirection='row'>
          <Tile
            url={ `/${ slug }/reports/human-capital-impact` }
            text={
              meta.humanCapImpact
                ? `${ Math.ceil(meta.humanCapImpact.countImpact) } FTE (${ ((meta.humanCapImpact.countImpact / meta.humanCapImpact.count) * 100).toFixed(2) }%)`
                : '-'
            }
            subText={
              meta.industryIndex
                ? `(Industry benchmark ${ meta.industryIndex }% )`
                : ''
            }
            icon={ HumanIcon }
            title={ reportsTitle.humanCapitalImpact }
          />
          <Tile
            url={ `/${ slug }/reports/roles-impacted` }
            text={
              meta.rolesImpact
                ? `${ meta.rolesImpact.role } ${ Math.ceil(meta.rolesImpact.countImpact) } FTE`
                : '-'
            }
            icon={ RolesIcon }
            title={ reportsTitle.rolesImpacted }
          />
          <Tile
            url={ `/${ slug }/reports/location` }
            text={
              meta.location
                ? `${ meta.location.state } ${ Math.ceil(meta.location.countImpact) } FTE`
                : '-'
            }
            icon={ LocationIcon }
            title={ reportsTitle.location }
          />
        </Flex>
      </Flex>
    )
  }
}
