/* @flow */
import React, { Component, type Element } from 'react'
import Ionicon from 'react-ionicons'
import { Flex } from 'ui'
import { Button, Popover, Position } from '@blueprintjs/core'

import fs from 'file-saver/FileSaver'

import styles from './styles.scss'

type svgType = {
  node: ?Element<*>,
}

type Props = {
  svgs: {
    top: svgType,
    bottom: svgType
  }
}

type State = {
  isPopoverOpen: boolean
}

class DownloadChart extends Component<Props, State> {
  constructor(props: Props, context: *) {
    super(props, context)
    this.state = { isPopoverOpen: false }
  }

  download(target: string) {
    if (!this.props.svgs[target].node) return

    const svg = this.props.svgs[target].node
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')

    const box = svg.getBBox()

    canvas.width = box.width + 40
    canvas.height = box.height + 40

    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')
    img.setAttribute('src', `data:image/svg+xml;base64,${ btoa(svgData) }`)

    img.onload = function () {
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => fs.saveAs(blob, 'chart.png'))
    }
  }

  handleInteraction(nextOpenState: boolean) {
    const isMultiple = this.props.svgs.top.node && this.props.svgs.bottom.node
    if (isMultiple) {
      this.setState({ isPopoverOpen: nextOpenState })
    } else {
      const target = this.props.svgs.top.node ? 'top' : 'bottom'
      this.download(target)
    }
  }

  render() {
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isiOS) return <div />
    return (
      <Popover
        className={ styles.downloadChartWrapper }
        content={
          <div>
            <Button onClick={ () => this.download('top') }>Top</Button>
            <Button onClick={ () => this.download('bottom') }>Bottom</Button>
          </div>
        }
        isOpen={ this.state.isPopoverOpen }
        onInteraction={ (state) => this.handleInteraction(state) }
        position={ Position.BOTTOM }
      >
        <Button className={ styles.downloadChartButton }>
          <Flex justifyContent='center' alignItems='center'>
            <div>Download Chart</div>&nbsp;
            <div>
              <Ionicon
                icon='ion-ios-download-outline'
                fontSize='25px'
                color={ styles.primaryColor } // eslint-disable-line css-modules/no-undef-class
              />
            </div>
          </Flex>
        </Button>
      </Popover>
    )
  }
}

export default DownloadChart
