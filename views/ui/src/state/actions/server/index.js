import {
    init,
    emit,
    connectUser,
} from './server';

const ROOM_JOINED = 'ROOM_JOINED';
const USERS       = 'USERS';
const MESSAGES    = 'MESSAGES';
const ROOMS       = 'ROOMS';
const PEOPLE      = 'PEOPLE';

export {
    init,
    emit,
    connectUser,
    ROOM_JOINED,
    USERS,
    MESSAGES,
    ROOMS,
    PEOPLE
}