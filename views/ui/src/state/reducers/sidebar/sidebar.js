import {
  CHOOSE_ROOM,
  CHOOSE_VIEW
} from 'state/actions/sidebar';

import { 
  ROOM_JOINED, 
  USERS 
} from 'state/actions/server';

const initialState = {
    view: 'ROOMS',
    currentRoom: {},
    rooms: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case CHOOSE_ROOM:
    return Object.assign({}, state, {
      currentRoom: payload,
    })

  case CHOOSE_VIEW:
    return Object.assign({}, state, {
      view: payload
    })

  case ROOM_JOINED:
  case USERS:
    return Object.assign({}, state, {
      rooms: Object.assign({}, state.rooms, {
        [payload.name]: payload
      })
    })

  default:
    return state
  }
}
