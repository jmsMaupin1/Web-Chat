import {
    init,
    emit,
    connectUser,
    getMessageHistory,
    sendMessage
} from './server';

const ROOM_JOINED  = 'ROOM_JOINED';
const USERS        = 'USERS';
const MESSAGES     = 'MESSAGES';
const CHAT_HISTORY = 'CHAT_HISTORY';
const ROOMS        = 'ROOMS';
const PEOPLE       = 'PEOPLE';

export {
    init,
    emit,
    connectUser,
    getMessageHistory,
    sendMessage,
    ROOM_JOINED,
    USERS,
    MESSAGES,
    CHAT_HISTORY,
    ROOMS,
    PEOPLE
}