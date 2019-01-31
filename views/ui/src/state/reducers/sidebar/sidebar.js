import {
  CHOOSE_ROOM,
  CHOOSE_VIEW
} from 'state/actions/sidebar';

import { 
  ROOM_JOINED, 
  USERS,
  CHAT
} from 'state/actions/server';

const initialState = {
    view: 'ROOMS',
    currentRoom: {},
    rooms: {}
}

function getRoomName(rooms, roomId) {
  let keys = Object.keys(rooms);

  for(let i = 0; i < keys.length; ++i)
    if(rooms[keys[i]]._id === roomId)
      return keys[i];
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
    return Object.assign({}, state, {
      rooms: Object.assign({}, state.rooms, {
        [payload.room.name] : {
          ...payload.room,
          lastMessage: payload.messages[payload.messages.length - 1]
        }
      })
    })

  case USERS:
    const room = state.rooms[payload.name];
    return Object.assign({}, state, {
      rooms: Object.assign({}, state.rooms, {
        [payload.name]: {
          ...payload,
          lastMessage: room ? room.lastMessage : ''  
        }
      })
    })

  case CHAT:
    let roomName = getRoomName(state.rooms, payload.room);
    return Object.assign({}, state, {
      rooms: Object.assign({}, state.rooms, {
        [roomName]: {
          ...state.rooms[roomName],
          lastMessage: payload
        }
      })
    });

  default:
    return state
  }
}
