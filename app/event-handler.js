const socket = require('socket.io');
const Message = require('./models/message');
const Room = require('./models/room');

const connectedUsers = [];

module.exports = (app) => {
	let io = socket(app);

	io.on('connection', (socket) => {

		socket.on('connect_user', (data) => {
			data.socket_id = socket.id;

			connectedUsers.push(data);
			Room.join("General", data._id, (err, room) => {
				if(err) throw err;

				io.to(socket.id).emit('room_joined', room);
			});

			io.sockets.emit('users', connectedUsers);
		})

		socket.on('disconnect', (data) => {
			connectedUsers.forEach((user, index) => {
				if(user.socket_id === socket.id){
					connectedUsers.splice(index, 1);
				}
			});

			io.sockets.emit('users', connectedUsers);
		})

		socket.on('chat', (data) => {
			new Message({
				created: Date.now(),
				message: data.message,
				user   : data.user,
				room   : data.room
			}).save((err, data) => {
				if(err) throw err;
				io.sockets.emit('chat', data);
			});
		});
	})
}