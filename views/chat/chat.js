// Connect to server socket
const socket = io.connect('http://localhost:8080');

// Query DOM
const message  = document.getElementById('message'),
	  feedback = document.getElementById('feedback');


var handle = '';
var lastHandle = '';
var lastMessageId = '';

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

// helper functions
var addNewMessage = function(myMessage, data) {
	lastMessageId = data._id;
	lastHandle    = data.handle;
	let newMessage = `
		<div class="${myMessage ? "my-message" : "other-message"}">
			<div class="content" id=${data._id}>
				<div class="message">
					<p>${data.message}</p>
				</div>
				<div class="username"><strong>${data.handle}</strong></div>
			</div>
		</div>
	`;

	feedback.innerHTML += newMessage;
}

var insertAfter = function(ref, newEl) {
	ref.insertAdjacentElement('beforeend', newEl)
}

var updateElement = function(ref, data) {

}

var addMessage = function(lastId, message) {
	let lastMessage = document.getElementById(lastMessageId);

	// Create our new message
	let newMessage = document.createElement('p');
	newMessage.innerHTML = message;

	// Insert message
	insertAfter(lastMessage.childNodes[1], newMessage);
	// Update new time
}

var formatDate = function(date, military) {

}

// Listen for socket events
socket.on('chat', data => {
	console.log(new Date(data.created).getHours());
	if(data.handle === lastHandle && lastMessageId !== "")
		addMessage(lastMessageId, data.message);
	else
		addNewMessage(data.handle === handle, data);
});

socket.on('initial_chats', data => {
	data.forEach( (message) => {
		if(lastHandle === "") {
			addNewMessage(message.handle === handle, message)
		} else {
			if(message.handle === lastHandle)
				addMessage(lastMessageId, message.message);
			else
				addNewMessage(message.handle === handle, message);
		}
	})
});