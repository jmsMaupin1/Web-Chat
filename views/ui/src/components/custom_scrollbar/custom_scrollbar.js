import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class CustomScrollbar extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <Scrollbars {...this.props} ref={this.props.setref}>
          {this.props.children}
      </Scrollbars>
    )
  }
}

CustomScrollbar.defaultProps = {
    setref: ''
}
