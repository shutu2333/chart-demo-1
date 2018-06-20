/* @flow */
import React, { Component } from 'react'
import classnames from 'classnames'
import Ionicon from 'react-ionicons'
import Dropzone from 'react-dropzone'

import styles from './styles.scss'

type Props = {
  onDrop: Function,
  fileUploaded: ?File,
}

class Upload extends Component<Props> {
  render() {
    return (
      <Dropzone
        className={ classnames(styles.buttons, styles.uploadButton) }
        activeClassName={ styles.dragActive }
        // accept='text/csv' // not reliable, check for file-type in the callback
        multiple={ false }
        onDrop={ (files) => this.props.onDrop(files[0]) }
      >
        <div className={ styles.roundButton }>
          <Ionicon
            icon='ion-ios-arrow-thin-up'
            fontSize='50px'
            color={ styles.primaryColor } // eslint-disable-line css-modules/no-undef-class
          />
        </div>
        <h5>Upload File</h5>
        <h6>Drop CSV file anywhere or browse your files</h6>
        <div style={ { minHeight: '24px' } }>
          { this.props.fileUploaded ?
            <span
              className={ classnames(styles.uploadedFileName, styles.zoomInAnimation) }
            >{ this.props.fileUploaded.name }
            </span>
          : '' }
        </div>
      </Dropzone>
    )
  }
}

export default Upload
