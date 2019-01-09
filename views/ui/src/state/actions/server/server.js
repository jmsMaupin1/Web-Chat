import io from 'socket.io-client';

const messageTypes = [
    'room_joined',
    'users',
    'chat_history'
];

const socket = io('http://localhost:8080');

export const init = store => {
    messageTypes.forEach( t => 
        socket.on(t, payload => {
            let type = t.toUpperCase();
            store.dispatch({type, payload})
        })
    );
};

export const emit = (type, payload) => socket.emit(type, payload);

export const connectUser = user => emit('connect_user', user);

export const getMessageHistory = user => emit('get_messages', user);

export const sendMessage = (room, message, user) => emit('chat', {
    room,
    message,
    user
})