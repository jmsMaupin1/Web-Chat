import { ROOM_JOINED, USERS } from 'state/actions/server';
const initialState = {
    rooms: {},
    currentRoom: null,
    participants: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case ROOM_JOINED:
    console.log(payload)
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

  default:
    console.log(type);  
    return state
  }
}
