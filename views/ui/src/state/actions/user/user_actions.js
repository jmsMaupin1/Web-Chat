import { 
  LOGIN_SUCCESS, 
  LOGIN_FAILURE, 
  REGISTER_SUCCESS, 
  REGISTER_FAILURE, 
  errorHandler 
} from 'state/actions';

import { history } from 'helper/history';

const registerSuccess = user => ({type: REGISTER_SUCCESS, payload: user});
const registerFailure = error => ({type: REGISTER_FAILURE, payload: error});

const loginSuccess  = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFail     = () => ({ type: LOGIN_FAILURE });

export const getUserInfo = () => dispatch => {
  console.log('getting /user info')
  fetch('/user')
    .then(errorHandler)
    .then(res => res.text())
    .then(user => {
      console.log(user);
      if(user) {
        dispatch(loginSuccess(user))
        history.push('/chat');
      }
    });
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