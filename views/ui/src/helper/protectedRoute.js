import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class protectedRoute extends Component {
  render() {
    const { user } = this.props;
    
    if (!user) return <Redirect to="/" />
    else return this.props.children
  }
}

export default connect(state => ({
    user: state.user.user
}))(protectedRoute)