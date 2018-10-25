const socket = io.connect('http://localhost:8080');

// Query DOM
const message = document.getElementById('message'),
	send = document.getElementById('send'),
	clear = document.getElementById('clear'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback'),
	chatwindow = document.getElementById('chat-window');


let handle;
// Get profile information
$.ajax({
	url:'http://localhost:8080/user_info',
	type: 'GET',
	dataType: 'json',
	success: (res) => {
		handle = res;
	}
});

// Event Listeners
send.addEventListener('click', () => {
	socket.emit('chat', {
		message: message.value,
		handle: handle
	})

	message.value = '';
})

message.addEventListener('keydown', (event) => {
	if(event.which === 13) {
		socket.emit('chat', {
			message: message.value,
			handle: handle
		})

		message.value = '';
	}
})

message.addEventListener('keypress', () => {
	socket.emit('typing', {
		handle: handle
	})
});

// Listen for socket events
socket.on('chat', data => {
	console.log(data);
	feedback.innerHTML += `<p><strong>${data.handle}: </strong>${data.message}</p>`
});

socket.on('initial_chats', data => {
	feedback.innerHTML = '';
	data.forEach((message) => feedback.innerHTML += `<p><strong>${message.author}: </strong>${message.content}</p`)
});