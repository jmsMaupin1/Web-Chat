import {
  CHOOSE_ROOM,
  CHOOSE_VIEW
} from 'state/actions/sidebar';

const initialState = {
    view: 'ROOMS',
    currentRoom: {},
    participants: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case CHOOSE_ROOM:
    return Object.assign({}, state, {
      currentRoom: payload,
      participants: payload.participants
    })

  case CHOOSE_VIEW:
    return Object.assign({}, state, {
      view: payload
    })

  default:
    return state
  }
}
