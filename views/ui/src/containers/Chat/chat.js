import React, { Component } from 'react'
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { history } from 'helper/history';

class chat_component extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }

  componentDidMount = () => {
    // Get chat rooms and participants per room
  }
  
  
  render() {
    const { user } = this.props;
    return (
      <div>
        <CssBaseline />
        <Drawer
          variant='permanent'
        ></Drawer>
      </div>
    )
  }
}

export const Chat = connect(state => (
  {
    user: state.userReducer.user
  })
)(chat_component);  