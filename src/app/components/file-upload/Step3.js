/* @flow */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  organizationSlug: string,
}

class Step3 extends Component<Props> {
  render() {
    return (
      <div>
        <p>Congratulations! Your data has been processed, you can view the reports in Dashboard</p>

        <Link to={ `/${ this.props.organizationSlug }` }>Take me to dashboard</Link>
      </div>
    )
  }
}

export default Step3
