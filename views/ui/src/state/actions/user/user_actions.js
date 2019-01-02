import { 
  LOGIN_SUCCESS, 
  LOGIN_FAILURE, 
  REGISTER_SUCCESS, 
  REGISTER_FAILURE, 
  errorHandler 
} from 'state/actions';

import io from 'socket.io-client';
import { history } from 'helper/history';

const registerSuccess = user => ({type: REGISTER_SUCCESS, payload: user});
const registerFailure = error => ({type: REGISTER_FAILURE, payload: error});

const loginSuccess  = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFail     = () => ({ type: LOGIN_FAILURE });

export const getUserInfo = () => dispatch => {
  fetch('/user')
    .then(errorHandler)
    .then(res => res.text())
    .then(user => {
      let userObj = JSON.parse(user);
      let doesUserPropExist = userObj.hasOwnProperty('user');

      if(!doesUserPropExist) { 
        dispatch(loginSuccess(user))
        history.push('/chat');
      }
    })
    .catch(err => console.log(err));
}

export const registerUser = (username, email, password) => dispatch => {
    fetch('/register', {
        method  : 'POST',
        headers : {'Content-Type': 'application/json'},
        body    : JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      })
      .then(errorHandler)
      .then(res => res.text())
      .then(user => {
        dispatch(registerSuccess(user));
        history.push('/chat');
      })
      .catch(err => dispatch(registerFailure()));
}

export const loginUser = (user, password) => dispatch => {

    fetch('/login', {
        method  : 'POST',
        headers : {'Content-Type': 'application/json'},
        body    : JSON.stringify({
          username: user,
          password: password
        })
      })
      .then(errorHandler)
      .then(res => res.text())
      .then(user => {
        dispatch(loginSuccess(user));
        history.push('/chat');
      })
      .catch(err => dispatch(loginFail()));
}