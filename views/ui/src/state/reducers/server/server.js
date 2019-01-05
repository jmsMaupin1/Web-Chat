import { ROOM_JOINED, USERS } from 'state/actions/server';
import { ROOMS, PEOPLE } from 'state/actions/server';
const initialState = {
    view : ROOMS,
    rooms: {},
    currentRoom: null,
    participants: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case ROOM_JOINED:
    return Object.assign({}, state, {
      rooms: Object.assign({}, state.rooms, {
        [payload.name]: payload
      })
  })

  case USERS:
    return Object.assign({}, state, {
      currentRoom: payload.name,
      participants: state.rooms[payload.name].participants
    })

  case ROOMS:
    return Object.assign({}, state, {
      view: ROOMS
    })

  case PEOPLE:
    return Object.assign({}, state, {
      view: PEOPLE
    })

  default:
    return state
  }
}
