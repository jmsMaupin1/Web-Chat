import io from 'socket.io-client';
import { isEmptyObject } from 'helper/util';

const messageTypes = [
    'room_joined',
    'users',
    'chat_history',
    'chat'
];

const socket = io('http://localhost:8080');

export const init = store => {
    messageTypes.forEach( t => 
        socket.on(t, payload => {
            let type = t.toUpperCase();
            console.log(type, payload)
            store.dispatch({type, payload})
        })
    );
};

export const emit = (type, payload) => socket.emit(type, payload);

export const connectUser = user => emit('connect_user', user);

export const getMessageHistory = room => emit('get_messages', room);

export const sendMessage = (room, message, user) =>  !isEmptyObject(room) ? emit('chat', {room, message, user}) : null;


export const privateMessage = (to, from) => emit('private_room', {
    to: to,
    from: from
})