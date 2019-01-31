const socket  = require('socket.io');
const Message = require('./models/message');
const Room    = require('./models/room');
const User    = require('./models/user');

let joinRoom = function(roomId, user, io, log) {
    Room.join(roomId, user, (err, room) => {
        if (err) throw err;

        Message.getMessagesInRoom(room, (err, messages) => {
            if (err) throw err;

            if (room.name === '') {
                let obj = room.participants.filter( participant => {
                    return participant._id.toString() !== user._id.toString();
                });

                let keys = Object.keys(obj);

                for (key in keys) {
                    room.name = obj[key].username;
                }
            }

            io.to(user.socket_id).emit('room_joined', {
                room: room,
                messages: messages
            })

            notifyParticipantsUserJoined(room, user, io);
        })
    }, log)
}

let notifyParticipantsUserJoined = function(room, user, io) {
        let { participants } = room;
        
        let participantsNotUser = participants.filter( participant => {
            return participant._id.toString() === user._id.toString();
        })

        if(participantsNotUser.length === 1 && room.name === '')
            room.name = participantsNotUser[0].username;
            
        participantsNotUser.forEach( p => {
            io.to(p.socket_id).emit('users', room);
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

                                notifyParticipantsUserJoined(room, user, io);                               
                            })
                        })
                    })
                })
            });
        })

        socket.on('connect_user', dataString => {
            let data = JSON.parse(dataString);
            data.socket_id = socket.id;

            User.updateUser(data._id, {
                socket_id: socket.id,
                online   : true
            }, (err, user) => {
                if (err) throw err;

                Room.createRoom('General', true, (err, room) => {
                    if (err) throw err;
                    joinRoom(room._id, user, io);
                })

                Room.createRoom('General 2', true, (err, room) => {
                    if (err) throw err;
                    joinRoom(room._id, user, io);
                })

                Room.getByParticipants(data._id, (err, rooms) => {
                    rooms.forEach( room => {
                        joinRoom(room._id, user, io);
                        socket.join(room._id);
                    })
                })
            })
        })

        socket.on('private_room', data => {
            Room.getByParticipants([data.to, data.from], (err, roomList) => {
                if (err) throw err;
                
                let rooms = roomList.filter( room => {
                    return (
                        !(room.name === "General" || room.name === "General 2")
                        &&(room.participants.length === 2));
                })
                
                if (rooms.length === 0)
                    Room.createRoom('', false, (err, room) => {
                        if (err) throw err;
                        joinRoom(room._id, data.from, io, true);
                        joinRoom(room._id, data.to, io);
                    })
                else {
                    rooms.forEach( room => {
                        Message.getMessagesInRoom(room._id, (err, messages) => {
                            if (err) throw err;

                            io.to(socket.id).emit('room_joined', {
                                room: room,
                                messages: messages
                            })
                        })
                        io.to(socket.id).emit('room_joined', room);
                    })
                }
            })
        })

        socket.on('create_room', data => {
            Room.createRoom(data.roomName, data.isPublic, (err, room) => {
                if (err) throw err;

                io.emit('room_created');
            }, data.user);
        })

        socket.on('chat', data => {
            new Message({
                created: Date.now(),
                message: data.message,
                user   : JSON.parse(data.user)._id,
                room   : data.room
            }).save((err, m) => {
                if (err) throw err;

                Message.populate(m, {path: 'user', model: 'User'}, (err, message) => {
                    if (err) throw err;

                    io.to(data.room._id).emit('chat', message);
                })
            });
        });

        socket.on('get_rooms', data => {
            let rooms = {};
            Room.getJoinableRooms(data, (err, room) => {
                if (err) throw err;

                rooms.joinable = room;
                Room.getByParticipants(data, (err, room) => {
                    rooms.mine = room;
                    io.to(socket.id).emit('rooms', rooms);
                })
            })


        })

        socket.on('join', data => {
            joinRoom(data.room._id, data.user, io);
        })

        socket.on('invite', data => {
            Room.isAdmin(data.room._id, data.admin, (err, isAdmin) => {
                if (err) throw err;

                if(isAdmin) {
                    joinRoom(data.room._id, data.user, io);
                } 
            })
        })

        socket.on('kick', data => {
            Room.kick(data.room._id, data.admin, data.user, (err, room) => {
                if (err) throw err;

                // let clients know user was kicked
            })
        })

        socket.on('get_messages', data => {
            socket.join(data._id);

            Message.getMessagesInRoom(data._id, (err, messages) => {
                io.to(socket.id).emit('chat_history', {
                    room: data,
                    messages: messages
                })
            })
        })

        socket.on('get_users', () => {
            User.getAll( (err, users) => {
                if (err) throw err;

                io.to(socket.id).emit('all_users', users);
            })
        })
    })
}