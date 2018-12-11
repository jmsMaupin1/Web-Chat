import { connect } from 'react-redux';
import { loginUser } from 'state/actions/login_actions';

import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  overflow: hidden;
  padding: 0 0 32px;
  margin: 48px auto 0;
  width: 300px;
  font-family: Quicksand, arial, sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, .05), 0 0px 40px rgba(0, 0, 0, .08);
  border-radius: 5px;
`
const CardHeader = styled.div`
  text-align: center;
  padding: 32px 0;
`;

const CardBody = styled.div`
  padding: 0 32px;
`;

const CardInput = styled.input`
  padding: 7px 0;
  margin: 15px 0;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid #ddd;
  transition: border-bottom-color .25s ease-in;

  &:focus {
    border-bottom-color: #e5195f;
    outline: 0;
  }
`;

const CardButton = styled.button`
  display: block;
  margin-top: 15px;
  width: 100%;
  padding: 12px 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: red;
  border: 0;
  border-radius: 25px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, .8);
  outline: none;
  cursor: pointer;
  transition: all .25s cubic-bezier(.02, .01, .47, 1);

  &:hover {
    box-shadow: 0 15px 15px rgba(0, 0, 0, .16);
    transform: translate(0, -5px);
  }
`;

const ModeSwitchButton = styled.button`
  display: block;
  margin: 25px 0;
  text-decoration: underline;
  outline: none;
  cursor: pointer;
  border: none;
  background: none;
`;


const LoginComponent = props => {
    return (
        <CardWrapper>
            <CardHeader>
                <h1>Welcome Back</h1>
                <h4>Please Log in</h4>
            </CardHeader>

            <CardBody>
                <CardInput value={props.username} onChange={props.onChange} name='username' type='text' placeholder='Username'/>
                <CardInput value={props.password} onChange={props.onChange} name='password' type='password' placeholder='password'/>
                <CardButton onClick={() => props.loginUser(props.username, props.password)}>Log In</CardButton>
                <ModeSwitchButton onClick={props.modeSwitch}>Dont have an account?</ModeSwitchButton>
            </CardBody>
        </CardWrapper>
    );
}

const RegisterComponent = props => {
    return (
        <CardWrapper>
            <CardHeader>
                <h1>New User</h1>
                <h4>Please register a new account</h4>
            </CardHeader>

            <CardBody>
                <CardInput name='username' type='text' placeholder='Username'/>
                <CardInput name='password' type='password' placeholder='password'/>
                <CardInput name='confirm-password' type='password' placeholder='confirm password'/>
                <CardButton>Sign up</CardButton>
                <ModeSwitchButton onClick={props.modeSwitch}>Already have an account?</ModeSwitchButton>
            </CardBody>
        </CardWrapper>
    );
}

const mapLoginDispatchToProps = {
    loginUser,
}

const mapRegisterDispatchToProps = {

}

export const Login = connect(null, mapLoginDispatchToProps)(LoginComponent);
export const Register = connect(null, mapRegisterDispatchToProps)(RegisterComponent);