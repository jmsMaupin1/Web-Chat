import { LOGIN_FAILURE, LOGIN_SUCCESS } from 'state/actions';

const initialState = {
    loggedIn: false,
    error: null,
    user: '',
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case LOGIN_FAILURE:
   return Object.assign({}, state, {
       loggingIn: false,
       error: 'Username or Password is incorrect'
   })

  case LOGIN_SUCCESS:
   return Object.assign({}, state, {
       user: payload,
       loggedIn: true,
   });

  default:
    return state
  }
}
