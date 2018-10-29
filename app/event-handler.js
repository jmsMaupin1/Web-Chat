const socket = require('socket.io');
const Message = require('./models/message');

const connectedUsers = [];

module.exports = (app) => {
	let io = socket(app);

	io.on('connection', (socket) => {

		Message.find( (err, messages) => {
			if(err) throw err;
			io.to(socket.id).emit('initial_chats', messages);
		});

		socket.on('connect_user', (data) => {
			connectedUsers.push({
				id: socket.id,
				handle: data
			})

			console.log('connect_user', data);
			io.sockets.emit('users', connectedUsers);
		})

		socket.on('chat', (data) => {
			new Message({
				created: Date.now(),
				message: data.message,
				handle : data.handle
			}).save((err, data) => {
				if (err) throw err;
				io.sockets.emit('chat', data);
			});
		});

		socket.on('get_users', (data) => {
			io.to(socket.id).emit('users', connectedUsers);
		})

		socket.on('disconnect', () => {
			connectedUsers.forEach((user, index) => {
				if(user.id === socket.id)
					connectedUsers.splice(index, 1);

				io.sockets.emit('users', connectedUsers);
			})
		})
	})
}