import React, { Component } from 'react'
import { connect } from 'react-redux';
import { history } from 'helper/history';

class chat_component extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    const { user } = this.props;
    return (
      <div>
        <h1>hello this is the chat path</h1>
      </div>
    )
  }
}

export const Chat = connect(state => (
  {
    user: state.userReducer.user
  })
)(chat_component);  