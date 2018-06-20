/* @flow */
import React, { Component, type Node, type ChildrenArray } from 'react'
import classnames from 'classnames'

export type Props = {
  children: ChildrenArray<Node>,
  className?: string,
}

export default class extends Component<Props, {
  classes: string
}> {
  static defaultProps = {
    className: '',
  }

  constructor(props: Props, context: *) {
    super(props, context)


    this.state = {
      classes: (
        this.props.className
          ? classnames(this.props.className)
          : ''
      ),
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      classes: (
        nextProps.className
          ? classnames(nextProps.className)
          : ''
      ),
    })
  }


  render() {
    return (
      <div className={ this.state.classes } > {this.props.children} </div>
    )
  }
}
