/* @flow */
import React, { PureComponent } from 'react'
import {
  Flex,
  Button,
  Input,
  Validation,
  DropdownSingle,
  type DropdownOptions,
} from 'ui'


import {
  type Organization,
  type User,
  type MembershipType,
  membershipTypes,
} from 'tandem'

import styles from './styles.scss'

type State = {
  user: {
    firstName: string,
    lastName: string,
    email: string,
    membershipType: MembershipType,
  },

  validationErrors: { [string]: ?string },


  userTypeOptions: DropdownOptions,
}

type Props = {
  organization: Organization,
  onClose: () => void,
  addNewUser: (string, $Shape<User>) => Promise<*>
}

export default class AddNewUser extends PureComponent<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)

    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        membershipType: 1,
      },

      validationErrors: {},


      userTypeOptions: Object.entries(membershipTypes)
        .map(([label, value]) => ({ label, value: (value: any) }))
        .filter(e => (parseInt(e.value, 10) <= membershipTypes.admin)),

    }
  }

  render() {
    const invalid = Object.values(this.state.validationErrors).filter(e => e).length > 0

    return (
      <Flex
        className={ styles.prompt }
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        onClick={ () => this.props.onClose() }
      >
        <div onClick={ e => e.stopPropagation() } role='presentation'>
          <div>
            <h2>Add New Member</h2>
            <p>Please use the form below to add a new user account to your organization.</p>
            <hr />
            <Input
              name='firstName'
              label='First Name'
              value={ this.state.user.firstName }
              onChange={ e => {
                this.setState({ user: { ...this.state.user, firstName: e.target.value } })
              } }
              validation={ [Validation.required()] }
              errors={ this.state.validationErrors }
              onValidationError={ (name, error) => (this.setState({
                validationErrors: { ...this.state.validationErrors, [name]: error },
              })) }
              type='text'
              placeholder='First Name'
            />
            <Input
              name='lastName'
              label='Last Name'
              value={ this.state.user.lastName }
              onChange={ e => {
                this.setState({ user: { ...this.state.user, lastName: e.target.value } })
              } }
              validation={ [Validation.required()] }
              errors={ this.state.validationErrors }
              onValidationError={ (name, error) => (this.setState({
                validationErrors: { ...this.state.validationErrors, [name]: error },
              })) }
              type='text'
              placeholder='Last Name'
            />
            <Input
              name='Email'
              label='Email'
              value={ this.state.user.email }
              onChange={ e => {
                this.setState({
                  user: { ...this.state.user, email: e.target.value.toLowerCase() },
                })
              } }
              validation={ [Validation.required()] }
              errors={ this.state.validationErrors }
              onValidationError={ (name, error) => (this.setState({
                validationErrors: { ...this.state.validationErrors, [name]: error },
              })) }
              type='text'
              placeholder='Email'
            />
            <DropdownSingle
              clearable={ false }
              label=''
              options={ this.state.userTypeOptions }
              value={ this.state.user.membershipType.toFixed() }
              onChange={ (e: *) => {
                this.setState({
                  user: { ...this.state.user, membershipType: parseInt(e.value, 10) },
                })
              } }
            />
          </div>
          <Button
            type='button'
            disabled={ invalid }
            onClick={ () => {
              if (invalid) return
              this.props.addNewUser(
                this.props.organization.id,
                this.state.user,
              ).then(
                () => this.props.onClose(),
              )
            } }
          >
            {'Add Member'}
          </Button>
        </div>
      </Flex>
    )
  }
}
