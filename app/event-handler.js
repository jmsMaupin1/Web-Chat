const socket = require('socket.io');
const Message = require('./models/message');

module.exports = (app) => {
	let io = socket(app);

	io.on('connection', (socket) => {
		Message.find( (err, messages) => {
			if(err) throw err;
			io.sockets.emit('initial_chats', messages);
		})

		socket.on('chat', (data) => {
			new Message({
				created: Date.now(),
				content: data.message,
				author : data.handle
			}).save((err) => {if (err) throw err});

			io.sockets.emit('chat', data);
		})
	})
}