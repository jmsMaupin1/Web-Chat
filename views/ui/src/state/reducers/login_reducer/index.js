import { LOGGING_IN_USER, LOGIN_FAILURE } from 'state/actions';

const initialState = {
    loggedIn: false,
    loggingIn: false,
    error: null,
    user: '',
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case LOGGING_IN_USER:
   return Object.assign({}, state, {
       loggingIn: true
   })

  case LOGIN_FAILURE:
   return Object.assign({}, state, {
       loggingIn: false,
       error: 'Username or Password is incorrect'
   })

  default:
    return state
  }
}
