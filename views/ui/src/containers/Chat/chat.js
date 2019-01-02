import React, { Component } from 'react'
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import { BottomNav } from 'components/bottom-navigation';
import { Sidebar } from 'components/sidebar';

import { connectUser } from 'state/actions/server';


class chat_component extends Component {
  componentDidMount = () => {
    connectUser(this.props.user);
  }
  
  render() {
    return (
      <div>
        <CssBaseline />
        <Grid container spacing={0}>
          <Grid item md={3}>
            <Sidebar />
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