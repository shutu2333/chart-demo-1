/* @flow */
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import { Flex, Button } from 'ui'
import { Classes } from '@blueprintjs/core'

import type { Organization } from 'tandem'

import styles from './styles.scss'

type Props = {
  organizations: Array<Organization>,
}

export default class OrganizationsPrompt extends PureComponent<Props> {
  render() {
    return (
      <Flex className={ styles.organizationPrompt } justifyContent='center' alignItems='center'>
        <div>
          <h2>Choose your organisation</h2>

          {
            this.props.organizations.map(org => {
              return (
                <Flex justifyContent='center' alignItems='center' key={ org.id }>
                  <div>
                    <Link to={ `/${ org.slug }` }>
                      <Button className={ Classes.FILL } width='200px' >{ org.name }</Button>
                    </Link>
                  </div>
                </Flex>
              )
            })
          }

        </div>
      </Flex>
    )
  }
}
