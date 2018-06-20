/* @flow */
import React, { Component } from 'react'

import {
  Flex,
  Switch,
  Button,
} from 'ui'

import {
  // membershipTypes,
  membershipLabels,
  type Organization,
  type User,
} from 'tandem'


import styles from './styles.scss'

import NewUserPrompt from './addNewUserPrompt'

type Props = {
  organization: Organization,

  users: ?Array<User>,
  getUsers: (organizationId: string) => Promise<Array<User>>,

  updateUser: (organizationId: string, user: $Shape<User> & {id: string}) => Promise<User>,
  addNewUser: (string, $Shape<User>) => Promise<*>

}

type State = {
  loading: boolean,
  failed: boolean,

  showNewUserPrompt: boolean,
}

export default class router extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      loading: false,
      failed: false,

      showNewUserPrompt: false,
    }
  }

  componentDidMount() {
    if (!this.props.users) {
      this.getUsers()
    }
  }

  componentDidUpdate() {
    if (!this.props.users && !this.state.loading) {
      this.getUsers()
    }
  }

  getUsers() {
    if (!this.state.loading && !this.state.failed) {
      this.setState({ loading: true }, () => {
        this.props.getUsers(
          this.props.organization.id,
        ).then(
          users => {
            if (users.length) {
              this.setState({
                loading: false,
              })
            } else {
              this.setState({ loading: false })
            }
          },
          () => this.setState({ loading: false, failed: true }),
        )
      })
    }
  }

  render() {
    const users = this.props.users

    if (this.state.failed) {
      return <p>Failed to load your users.</p>
    }


    if (this.state.loading || !users) {
      return <p>Please wait while we load users...</p>
    }

    return (
      <Flex
        flexDirection='column'
        alignContent='stretch'
      >

        {
          this.state.showNewUserPrompt
            ? (
              <NewUserPrompt
                organization={ this.props.organization }
                onClose={ () => { this.setState({ showNewUserPrompt: false }) } }
                addNewUser={ this.props.addNewUser }
              />
            )
            : null
        }

        <Flex
          flexDirection='row'
          justifyContent='space-between'
          alignItems='flex-end'
          className={ styles.header }
        >
          <h1>{ this.props.organization.name } Members</h1>
          <Button
            type='button'
            className={ styles.addUser }
            onClick={ () => this.setState({ showNewUserPrompt: true }) }
            width='100%'
          >
            Add New Member
          </Button>
        </Flex>

        <Flex flexDirection='column' className={ styles.list }>
          <Flex key='header' className={ styles.listHeader } flexDirection='row'>
            <Flex flex={ 1 } key='First Name' >First Name</Flex>
            <Flex flex={ 1 } key='Last Name'>Last Name</Flex>
            <Flex flex={ 4 } key='Email' >Email</Flex>
            <Flex flex={ 1 } key='Role'>Role</Flex>
            <Flex flex={ 2 } key='Deactivate' justifyContent='center'>Deactivate</Flex>
          </Flex>
          {
            users
              .sort((a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName))
              .map((u: User) => (
                <Flex key={ u.id } className={ styles.listItem } flexDirection='row'>
                  <Flex flex={ 1 } key='First Name' >{ u.firstName }</Flex>
                  <Flex flex={ 1 } key='Last Name'>{ u.lastName }</Flex>
                  <Flex flex={ 4 } key='Email' >{ u.email }</Flex>
                  <Flex flex={ 1 } key='Role' >{ u.membershipType ? membershipLabels[u.membershipType] : 'Other' }</Flex>
                  <Flex flex={ 2 } key='Active' justifyContent='center'>
                    <Switch
                      checked={ !u.membershipActive }
                      label={ !u.membershipActive ? 'Deactivated' : '' }
                      onChange={ () => {
                        this.props.updateUser(
                          this.props.organization.id,
                          { id: u.id, membershipActive: !u.membershipActive },
                        )
                      } }
                    />
                  </Flex>
                </Flex>
              ))
          }
        </Flex>
      </Flex>
    )
  }
}
