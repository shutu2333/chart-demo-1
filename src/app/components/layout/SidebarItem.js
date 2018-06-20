/* @flow */
import React, { Component, type Element } from 'react'
import classnames from 'classnames'
import { Classes } from '@blueprintjs/core'

import styles from './styles.scss'

export type Props = {
  icon: Element<*>,
  item: Element<*> | string,
  children?: Element<*>,
  disabled?: boolean,
  className?: string
}

class SidebarItem extends Component<Props> {
  static defaultProps = {
    className: '',
    dropdown: null,
  }

  render() {
    return (
      <div
        className={ classnames(
          styles.menuItemWrapper,
          this.props.className,
          this.props.disabled && styles.disabled,
        ) }
      >
        <div className={ classnames(styles.iconWrapper) }>
          { this.props.icon }
        </div>
        <span className={ classnames(styles.menuItemDisplayName) }>
          { this.props.item }
        </span>
        { this.props.children }
        <span className={ classnames(Classes.MENU_DIVIDER, styles.divider) } />
      </div>
    )
  }
}

export default SidebarItem
