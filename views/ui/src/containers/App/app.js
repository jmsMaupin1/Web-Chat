import React, { Component } from 'react';
import { Login, Register } from 'components/login';
import { connect } from 'react-redux';
import { getUserInfo } from 'state/actions/user';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: true,
      username: '',
      password: '',
      email: ''
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

  componentDidMount = () => {
    this.props.getUserInfo();
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
        email={this.state.email} 
        password={this.state.password}/>
  }

}

const mapLoginDispatchToProps = {
  getUserInfo
}

export default connect(null, mapLoginDispatchToProps)(App)