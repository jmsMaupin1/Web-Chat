import React, { Component } from 'react'
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import BottomNav from 'components/bottom-navigation';


class chat_component extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }  
  
  render() {
    const { value } = this.state;
    return (
      <div>
        <CssBaseline />
        <Grid container spacing={0}>
          <Grid item md={3}>
            <div style={{height: '93vh', background: '#363E47'}}>
            </div>
            <BottomNav />
          </Grid>
          <Grid item md={9}>
            {/* <ChatWindow /> */}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export const Chat = connect(state => (
  {
    user: state.userReducer.user
  })
)(chat_component);  