/*
    states: fetching rooms
                -fetches users in room
                -fetches convo history
            fetching messages
                -fetches conv history
            room success
                -payload:
                    -name (of the room)
                    -pubic (is it joinable)
                    -participants
                    -admins
            messages sucess
                -payload:
                    - room: (see room sucess for payload information)
                    -messages
                        created
                        message
                        user
                        room 
            room failure
            message failure
*/

import {
    FETCHING_ROOM,
    ROOM_FETCH_SUCCESS,
    ROOM_FETCH_FAILURE,
    FETCHING_MESSAGE_HISTORY,
    MESSAGE_HISTORY_FETCH_SUCCESS,
    MESSAGE_HISTORY_FETCH_FAILURE
} from 'state/actions'