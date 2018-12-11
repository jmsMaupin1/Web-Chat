import React, { Component } from 'react';
import { Login, Register } from 'components/login';

export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: true,
      username: '',
      password: ''
    }

    this.modeSwitch = this.modeSwitch.bind(this);
    this.onChange   = this.onChange.bind(this);
  }

  modeSwitch(e) {
    e.preventDefault();

    this.setState({login: !this.state.login})
  }  

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const {login} = this.state;

    return login ? 
      <Login 
        onChange={this.onChange}  
        modeSwitch={this.modeSwitch}
        username={this.state.username} 
        password={this.state.password}/> : 

      <Register 
        onChange={this.onChange} 
        modeSwitch={this.modeSwitch}
        username={this.state.username} 
        password={this.state.password}/>
  }
}
