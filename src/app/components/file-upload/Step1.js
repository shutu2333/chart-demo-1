/* @flow */
import React, { Component } from 'react'
import { Button, Collapse } from '@blueprintjs/core'
import Ionicon from 'react-ionicons'
import { Flex } from 'ui'
import classnames from 'classnames'

import Download from './Download'
import Upload from './Upload'
import styles from './styles.scss'

type Props = {
  onLoad: (File) => void,
  UpdateErrorMessage: Function,
}

type State = {
  uploadingTipsOpen: boolean,
  fileUploaded: ?File
}

class Step1 extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      uploadingTipsOpen: false,
      fileUploaded: null,
    }
  }

  onDrop(csv: File) {
    if (csv.name.split('.').pop() !== 'csv' && csv.type !== 'text/csv') {
      this.props.UpdateErrorMessage('File not allowed, please upload only .csv files')
    } else {
      this.setState({ fileUploaded: csv })
    }
  }

  render() {
    return (
      <div>
        <p>
          The Tandem prediction algorithm works best when assessing a complete and accurate dataset.
          While not all fields are mandatory, the additional information requested in the template
          will assist in providing deeper insights when reviewing your results.
        </p>

        <Button
          className={ styles.uploadingTipsButton }
          onClick={ () => { this.setState({ uploadingTipsOpen: !this.state.uploadingTipsOpen }) } }
        >
            See uploading tips
          <Ionicon
            icon={ this.state.uploadingTipsOpen ? 'ion-ios-minus-outline' : 'ion-ios-plus-outline' }
            fontSize='22px'
            // eslint-disable-next-line css-modules/no-undef-class
            color={ styles.primaryColor }
          />
        </Button>
        <Collapse isOpen={ this.state.uploadingTipsOpen }>
          <ul className={ styles.uploadingTipsList }>
            <li>
              <strong>
                {'Each row provides detailed information for an individual employee, please complete as many fields as possible.'}
              </strong>
              <br />
              {'At a minimum, Tandem requires: role name, business unit, and location information at State level with geo coordinates (latitude, longitude).'}
            </li>
            <li>
              <strong>
                {'Tandem predictions are based on the ONET-SOC taxonomy, please complete the eight digit SOC-code for each of your roles before submitting.'}
              </strong>
              <br />
              {'If you do not currently use SOC codes, you can search for the relevant codes by entering the role name into the search form at'}
              <a href='https://www.onetonline.org' target='_blank' rel='noopener noreferrer'>https://www.onetonline.org</a>
              {'. Please choose SOC-codes that best describe your roles and have been annotated by O*NET'}
              {'(e.g. details are available describing tasks and skills).'}
            </li>
            <li>
              <strong>
                All data within a column should be of a standard format throughout
              </strong>
              <br />
              e.g. same date format.
            </li>
            <li>
              <strong>
                {'Total compensation should include super and bonus, however please enter values appropriate to your organisation'}
              </strong>
            </li>
            <li>
              <strong>
                Redundancy cost should be entered as a percentage (% of total salary)
              </strong>
            </li>
          </ul>
        </Collapse>

        <Flex flexDirection='row' justifyContent='space-between' className={ styles.buttonsContainer }>

          <Download />
          <Upload onDrop={ (file) => this.onDrop(file) } fileUploaded={ this.state.fileUploaded } />

        </Flex>

        <div style={ { textAlign: 'center', marginTop: '20px', minHeight: '30px', width: '50%', marginLeft: '50%' } }>
          { this.state.fileUploaded ?
            <Button
              className={ classnames(styles.continueButton, styles.zoomInAnimation) }
              onClick={ () => {
                if (this.state.fileUploaded) this.props.onLoad(this.state.fileUploaded)
              } }
            >Continue
            </Button>
          : '' }
        </div>
      </div>
    )
  }
}

export default Step1
