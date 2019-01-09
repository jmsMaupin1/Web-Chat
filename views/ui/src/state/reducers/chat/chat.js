import { CHAT_HISTORY } from 'state/actions/server';
const initialState = {
    messages: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case CHAT_HISTORY:    
    return Object.assign({}, state, {
        messages: Object.assign({}, state.messages, {
            [payload.room.name] : payload.messages
        })
    })

  default:
    return state
  }
}
