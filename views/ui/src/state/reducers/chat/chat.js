import { CHAT_HISTORY, CHAT } from 'state/actions/server';
const initialState = {
    messages: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case CHAT_HISTORY:
    return Object.assign({}, state, {
        messages: Object.assign({}, state.messages, {
            [payload.room._id] : payload.messages
        })
    })

  case CHAT:
    let messages = state.messages[payload.room];
    messages.push(payload);
    return Object.assign({}, state, {
      messages: Object.assign({}, state.messages, {
        [payload.room] : messages
      })
    })

  default:
    return state
  }
}
