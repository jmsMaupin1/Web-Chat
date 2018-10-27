const socket = io.connect('http://localhost:8080');

// Query DOM
const message  = document.getElementById('message'),
	  feedback = document.getElementById('feedback');


var handle = '';
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
var messageKeyPress = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;

	if(key == 13 && !e.shiftKey){
		socket.emit('chat', {
			message: message.value,
			handle: handle
		})

		message.value = '';
		e.preventDefault();
	} else {
		socket.emit('typing', {
			handle: handle
		});
	}
}

// Listen for socket events
socket.on('chat', data => {
	if(data.handle === handle) 
		feedback.innerHTML += `
			<div class="my-message">
				<div class="content">
					<div class="message">${data.message}</div>
					<div class="username"><strong>${data.handle}</strong></div>
				</div>
			</div>
		`;
	else
		feedback.innerHTML += `
			<div class="other-message">
				<div class="content">
					<div class="message">${data.message}</div>
					<div class="username"><strong>${data.handle}</strong></div>
				</div>
			</div>
		`; 
});

socket.on('initial_chats', data => {
	data.forEach( (message) => {
		if(message.author == handle)
			feedback.innerHTML += `
				<div class="my-message">
					<div class="content">
						<div class="message">${message.content}</div>
						<div class="username"><strong>${message.author}</strong></div>
					</div>
				</div>
			`;
		else
			feedback.innerHTML += `
				<div class="other-message">
					<div class="content">
						<div class="message">${message.content}</div>
						<div class="username"><strong>${message.author}</strong></div>
					</div>
				</div>
			`;
	})
});