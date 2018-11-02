const socket  = require('socket.io');
const Message = require('./models/message');
const Room    = require('./models/room');
const User    = require('./models/user');

const connectedUsers = [];

// Helper functions
let joinRoom = function(roomId, data, io) {
    Room.join(roomId, data, (err, room) => {
        if (err) throw err;

        
        io.to(data.socket_id).emit('room_joined', room);

        room.participants.forEach( p => {
            io.to(p.socket_id).emit('users', room);
        })
    })
}

module.exports = app => {
    let io = socket(app);

    io.on('connection', socket => {

        socket.on('disconnect', () => {
            User.findOne({socket_id: socket.id}, (err, user) => {
                if (err) throw err;
                if (!user) return;

                User.updateUser(user._id, {
                    socket_id : '',
                    online    : false
                }, (err, user) => {
                    if (err) throw err;
                    Room.getByParticipants(user._id, (err, rooms) => {
                        rooms.forEach( room => {
                            Room.populate(room, {path: 'participants', model: 'User', select: 'username online socket_id'}, (err, room) => {
                                if (err) throw err;

                                room.participants.forEach( p => {
                                    io.to(p.socket_id).emit('users', room);
                                })                                
                            })
                        })
                    })
                })
            });
        })

        socket.on('connect_user', data => {
            data.socket_id = socket.id;

            User.updateUser(data._id, {
                socket_id: socket.id,
                online   : true
            }, (err, user) => {
                if (err) throw err;

                Room.createRoom('General', (err, room) => {
                    if (err) throw err;
                    joinRoom(room._id, user, io);
                })

                Room.createRoom('General 2', (err, room) => {
                    if (err) throw err;
                    joinRoom(room._id, user, io);
                })
            })
        })

        socket.on('chat', data => {
            new Message({
                created: Date.now(),
                message: data.message,
                user   : data.user._id,
                room   : data.room
            }).save((err, m) => {
                if (err) throw err;

                Message.populate(m, {path: 'user', model: 'User'}, (err, message) => {
                    if (err) throw err;
                    io.sockets.emit('chat', message);
                })
            });
        });

        socket.on('get_rooms', data => {
            Room.getByParticipants(data, (err, rooms) => {
                if (err) throw err;

                io.to(socket.id).emit('room_list', rooms);
            })
        })

        socket.on('get_messages', data => {
            Message.getMessagesInRoom(data._id, (err, messages) => {
                io.to(socket.id).emit('chat_history', {
                    room: data,
                    messages: messages
                })
            })
        })
    })
}