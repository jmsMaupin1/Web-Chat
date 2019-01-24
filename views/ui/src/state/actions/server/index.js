import {
    init,
    emit,
    connectUser,
    getMessageHistory,
    sendMessage,
    privateMessage
} from './server';

const ROOM_JOINED  = 'ROOM_JOINED';
const USERS        = 'USERS';
const MESSAGES     = 'MESSAGES';
const CHAT_HISTORY = 'CHAT_HISTORY';
const CHAT         = 'CHAT';
const ROOMS        = 'ROOMS';
const PEOPLE       = 'PEOPLE';

export {
    init,
    emit,
    connectUser,
    getMessageHistory,
    sendMessage,
    privateMessage,
    ROOM_JOINED,
    USERS,
    MESSAGES,
    CHAT_HISTORY,
    CHAT,
    ROOMS,
    PEOPLE
}