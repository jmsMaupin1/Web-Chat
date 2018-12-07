import React, { Component } from 'react';
import { Login, Register } from 'components/login';

export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: true,
    }

    this.modeSwitch = this.modeSwitch.bind(this);
  }

  modeSwitch(e) {
    e.preventDefault();

    this.setState({login: !this.state.login})
  }

  render() {
    const {login} = this.state;

    return login ? 
      <Login modeSwitch={this.modeSwitch}/> : 
      <Register modeSwitch={this.modeSwitch}/>
  }
}
