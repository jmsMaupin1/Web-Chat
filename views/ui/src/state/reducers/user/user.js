import { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE } from 'state/actions';

const initialState = {
    user: null,
    error: null
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case REGISTER_SUCCESS:
    return Object.assign({}, state, {
        user: payload
    })

  case REGISTER_FAILURE:
    return Object.assign({}, state, {
        error: payload
    })

  case LOGIN_SUCCESS:
    return Object.assign({}, state, {
        user: payload
    })

  case LOGIN_FAILURE:
    return Object.assign({}, state, {
        error: payload
    })

  default:
    return state
  }
}
