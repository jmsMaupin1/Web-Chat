const socket  = require('socket.io');
const Message = require('./models/message');
const Room    = require('./models/room');

const connectedUsers = [];

module.exports = (app) => {
    let io = socket(app);

    io.on('connection', (socket) => {

        socket.on('connect_user', (data) => {
            data.socket_id = socket.id;

            connectedUsers.push(data);
            Room.join("General", data._id, (err, room) => {
                if (err) throw err;

                io.to(socket.id).emit('room_joined', room);
            });

            io.sockets.emit('users', connectedUsers);
        })

        socket.on('disconnect', (data) => {
            connectedUsers.forEach((user, index) => {
                if (user.socket_id === socket.id){
                    connectedUsers.splice(index, 1);
                }
            });

            io.sockets.emit('users', connectedUsers);
        })

        socket.on('chat', (data) => {
            new Message({
                created: Date.now(),
                message: data.message,
                user   : data.user._id,
                room   : data.room
            }).save((err, m) => {
                if (err) throw err;

                Message.populate(m, {path: 'user', model: 'User'}, (err, message) => {
                    if (err) throw err;
                    message.user.local = {
                        username: message.user.local.username,
                    }
                    io.sockets.emit('chat', message);
                })
            });
        });

        socket.on('private_room', (data) => {
            let roomName = data.to.username + ' and ' + data.from.username;

            Room.join(roomName, data.from.username, (err, room) => {
                io.to(socket.id).emit('room_joined', room);
            })

            Room.join(roomName, data.to.username, (err, room) => {
                io.to(data.to.socket_id).emit('room_joined', room);
            })
        })

        socket.on('get_messages', (data) => {
            Message.getMessagesInRoom(data._id, (err, messages) => {
                io.to(socket.id).emit('chat_history', {
                    room: data,
                    messages: messages
                })
            })
        })
    })
}