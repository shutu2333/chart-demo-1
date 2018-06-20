/* @flow */

import React, { Component } from 'react'
import { connect, type MapStateToProps } from 'react-redux'
import { MenuItem, Collapse } from '@blueprintjs/core'
import Ionicon from 'react-ionicons'

import classnames from 'classnames'
import whatInput from 'what-input'

import {
  withRouter,
  type Location,
  type RouterHistory,
  // Link,
} from 'react-router-dom'

import {
  type User,
  type Organization,
  membershipTypes,
} from 'tandem'

import { type State as AuthState } from '../../factors/auth'
import SidebarItem from './SidebarItem'
import UserAvatar from '../user/UserAvatar'
import UserPanel from '../user/UserPanel'

import jobNeighbourhood from '../../assets/img/job_neighbourhood.svg'
import jobNeighbourhoodActive from '../../assets/img/job_neighbourhood_active.svg'
import jobCorridor from '../../assets/img/job_corridor.svg'
import jobCorridorActive from '../../assets/img/job_corridor_active.svg'
import smallLogo from '../../assets/img/Faethm_Square_White.svg'

import styles from './styles.scss'

export type ownProps = {
  location: Location,
  history: RouterHistory,
  organizations: Array<Organization>,
  currentOrganization?: string,
}


export type stateProps = {
  user: ?User,
}

type Props = ownProps & stateProps

type State = {
  openPanels: {
    user: boolean,
  },
  isHovered: boolean
}

class Sidebar extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      openPanels: {
        user: false,
      },
      isHovered: false,
    }
  }

  getWelcomeMessage() {
    if (this.props.user) {
      return `Welcome ${ this.props.user.firstName }`
    }
    return 'User Profile'
  }

  isActive(path: string | Array<string>) {
    if (typeof path === 'string') {
      return this.props.location.pathname === path
    } else if (Array.isArray(path)) {
      return path.includes(this.props.location.pathname)
    }
    return false
  }

  menuItemColorHelper(path: string | Array<string>) {
    if (this.isActive(path)) {
      return styles.primaryColor // eslint-disable-line css-modules/no-undef-class
    }
    return styles.lighterGray // eslint-disable-line css-modules/no-undef-class
  }

  handleHover(open: boolean) {
    if (whatInput.ask() !== 'touch') {
      // skip on touch devices
      this.toggleSidebar(open)
    }
  }

  togglePanel(panel: string) {
    this.setState({
      openPanels: {
        ...this.state.openPanels,
        [panel]: !this.state.openPanels[panel],
      },
    })
  }


  toggleSidebar(open: boolean) {
    this.setState({
      isHovered: open,
      openPanels: {
        user: open ? this.state.openPanels.user : false,
      },
    })
  }

  handleKeyPress(event, path: string | null, panel: string = '') {
    if (event.key === 'Enter') {
      this.handleClick(path, panel)
    }
  }

  handleClick(path: string | null, panel: string = '') {
    if (this.state.isHovered) {
      if (panel) {
        this.togglePanel(panel)
      } else if (path) {
        let url = path

        const slug = this.props.currentOrganization
        url = slug ? `/${ slug }${ path }` : path

        this.props.history.push(url)

        this.toggleSidebar(false)
      }
    } else {
      this.setState({
        isHovered: true,
      })
    }
  }

  dropDownIcon(openPanelState: boolean) {
    return (
      <span className={ styles.dropdownIconsWrapper }>
        <Ionicon
          icon={ openPanelState ? 'ion-ios-arrow-up' : 'ion-ios-arrow-down' }
          fontSize='22px'
          color={ styles.lighterGray } // eslint-disable-line css-modules/no-undef-class, max-len
        />
      </span>
    )
  }

  render() {
    if (!this.props.user) return null

    const currentOrganization =
      this.props.currentOrganization &&
      this.props.organizations.find(e => e.slug === this.props.currentOrganization)

    const userIsCurrentOrganizationAdmin =
      currentOrganization &&
      currentOrganization.membershipType &&
      currentOrganization.membershipType >= membershipTypes.admin

    return (
      <div
        onMouseEnter={ () => this.handleHover(true) }
        onMouseLeave={ () => this.handleHover(false) }
        className={ classnames(styles.sidebar, this.state.isHovered ? 'hover' : '') }
      >
        <MenuItem
          onClick={ () => { this.handleClick('/') } }
          text={ (
            <SidebarItem
              onMouseEnter={ () => this.handleHover(true) }
              onMouseLeave={ () => this.handleHover(false) }
              className={ styles.logoItem }
              icon={ <img src={ smallLogo } alt='Tandem' className={ styles.smallLogo } /> }
              item={ (
                <span className={ styles.companyName }>Fæthm</span>
              ) }
            />
          ) }
        />

        <li>
          <div
            className={ styles.sidebarItemWrapper }
            role='button'
            tabIndex={ 0 }
            onClick={ () => { this.handleClick(null, 'user') } }
            onKeyPress={ e => { this.handleKeyPress(e, null, 'user') } }

          >
            <SidebarItem
              className={ this.state.openPanels.user ? styles.panelOpen : '' }
              icon={ <UserAvatar user={ this.props.user } /> }
              item={ (
                <span>{ this.getWelcomeMessage() }
                  { /* <span className={ styles.orgName }>{ orgName }</span> */ }
                </span>
              ) }
            >
              <div>
                { this.dropDownIcon(this.state.openPanels.user) }
                <Collapse isOpen={ this.state.openPanels.user }>
                  <UserPanel organizations={ this.props.organizations } />
                </Collapse>
              </div>
            </SidebarItem>
          </div>
        </li>

        <MenuItem
          onClick={ () => { this.handleClick('/') } }
          text={ (
            <SidebarItem
              icon={ <Ionicon icon='ion-ios-keypad-outline' fontSize='30px' color={ this.menuItemColorHelper('/') } /> }
              item='Dashboard'
            />
          ) }
        />

        <MenuItem
          onClick={ () => { this.handleClick('/reports/job-neighbourhood') } }
          text={ (
            <SidebarItem
              icon={ (
                <img
                  src={ this.isActive('/reports/job-neighbourhood') ? jobNeighbourhoodActive : jobNeighbourhood }
                  alt='Job Neighbourhood'
                  color={ this.menuItemColorHelper('/reports/job-neighbourhood') }
                  className={ styles.customIcon }
                />
              ) }
              item='Job Neighbourhood'
            />
          ) }
        />

        <MenuItem
          onClick={ () => { this.handleClick('/reports/job-corridor') } }
          text={ (
            <SidebarItem
              icon={ (
                <img
                  src={ this.isActive('/reports/job-corridor') ? jobCorridorActive : jobCorridor }
                  alt='Job Corridor'
                  color={ this.menuItemColorHelper('/reports/job-corridor') }
                  className={ styles.customIcon }
                />
              ) }
              item='Job Corridor'
            />
          ) }
        />

        <MenuItem
          onClick={ () => { if (userIsCurrentOrganizationAdmin) this.handleClick('/file-upload') } }
          disabled={ !userIsCurrentOrganizationAdmin }
          text={ (
            <SidebarItem
              disabled={ !userIsCurrentOrganizationAdmin }
              icon={ <Ionicon icon='ion-ios-plus-outline' fontSize='30px' color={ this.menuItemColorHelper('/file-upload') } /> }
              item='File Upload'
            />
          ) }
        />

        {
          /*
          userIsCurrentOrganizationAdmin
          ? (
            <MenuItem
              onClick={ () => { this.handleClick('/manage') } }
              text={ (
                <SidebarItem
                  icon={ <Ionicon
                    icon='ion-ios-gear-outline'
                    fontSize='30px'
                    color={ this.menuItemColorHelper('/manage') }
                    /> }
                  item='Manage'
                />
              ) }
            />
          )
          : null
          */
        }
        { /*
        <MenuItem
          onClick={ () => { this.handleClick('/history') } }
          text={ (
            <SidebarItem
              onMouseEnter={ () => this.handleHover(true) }
              onMouseLeave={ () => this.handleHover(false) }
              icon={ <Ionicon
                icon='ion-ios-clock-outline'
                fontSize='30px'
                color={ this.menuItemColorHelper('/history') }
              /> }
              item='History'
            />
          ) }
        />
        */ }
      </div>
    )
  }
}

type AppState = {
  auth: AuthState,
}

function mapStateToProps(state: AppState, op: ownProps): Props {
  return {
    history: op.history,
    location: op.location,
    organizations: op.organizations,
    user: state.auth.user,
  }
}

type MSTP = MapStateToProps<AppState, ownProps, Props>
export default withRouter(connect((mapStateToProps: MSTP))(Sidebar))
