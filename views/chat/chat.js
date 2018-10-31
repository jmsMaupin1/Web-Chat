// Connect to server socket
const socket        = io.connect('http://localhost:8080');

// Query DOM
const message       = document.getElementById('message'),
      feedback      = document.getElementById('feedback');
      rooms         = document.getElementById('rooms');
      people        = document.getElementById('people');


let handle          = '';
let me              = {};
let room            = {};
let roomList        = [];
let lastHandle      = '';
let lastMessageId   = '';
let connectedUsers  = [];

// helper functions
let insertAfter = function(ref, newEl) {
    ref.insertAdjacentElement('beforeend', newEl)
}

let addNewMessage = function(data) {
    lastMessageId = data._id;
    lastHandle    = data.user.local.username;

    let myMessage = data.user.local.username === me.username;

    let newMessage = `
        <div class="${myMessage ? "my-message" : "other-message"}">
            <div class="content" id=${data._id}>
                <div class="message">
                    <p>${data.message}</p>
                </div>
                <div class="username"><strong>${data.user.local.username}</strong></div>
            </div>
        </div>
    `;

    feedback.innerHTML += newMessage;
}

let addMessage = function(lastId, message) {
    let lastMessage = document.getElementById(lastMessageId);

    // Create new message
    let newMessage = document.createElement('p');
    newMessage.innerHTML = message;

    // Insert message
    insertAfter(lastMessage.childNodes[1], newMessage);
}

let postMessage = function(message) {
    if (lastHandle === '')
        addNewMessage(message)
    else if (message.user.local.username === lastHandle && lastMessageId !== "")
        addMessage(lastMessageId, message.message);
    else
        addNewMessage(message)
}

let populateSidebarList = function(template, data) {
    let sidebar = document.getElementById('sidebar-list');

    sidebar.innerHTML = '';

    data.forEach( d => {
        insertAfter(sidebar, template(d));
    })
}

let userTemplate = function(data) {
    let panel = document.createElement('div');
    panel.className = 'detail';
    panel.innerHTML = `
        <a href="#">
            <h3>${data.username}</h3>
        </a>
    `;

    panel.addEventListener('click', () => {
        socket.emit('private_room', {
            to: data,
            from: me
        });
    })

    return panel;
}

let roomTemplate = function(data) {
    let panel = document.createElement('div');
    panel.className = 'detail';
    panel.innerHTML = `
        <a href="#">
            <h3>${data.name}</h3>
        </a>
    `;

    panel.addEventListener('click', () => {
        socket.emit('get_messages', room);
    })

    return panel;
}

// Get profile information
$.ajax({
    url:'http://localhost:8080/user_info',
    type: 'GET',
    dataType: 'json',
    success: res => {
        handle = res.username;
        me     = res;
        socket.emit('connect_user', res);
    }
});

// Event Listeners
let messageKeyPress = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;

    if (key == 13 && !e.shiftKey){ // enter = 13
        socket.emit('chat', {
            room   : room,
            message: message.value,
            user   : me
        })

        message.value = '';
        e.preventDefault();
    } else {
        socket.emit('typing', {
            handle: handle
        });
    }
}

rooms.addEventListener('click', () => {
    socket.emit('get_rooms', me._id);
})

people.addEventListener('click', () => {
    populateSidebarList(userTemplate, connectedUsers.filter( user => user._id !== me._id));
})


// Listen for socket events
socket.on('room_joined', data => {
    room = data;
    socket.emit("get_messages", room);
});

socket.on('room_list', data => {
    populateSidebarList(roomTemplate, data);
})

socket.on('chat_history', data => {
    feedback.innerHTML = '';

    data.messages.forEach( message => {
        postMessage(message);
    });
})

socket.on('chat', data => {
    postMessage(data);
});

socket.on('users', data => {
    connectedUsers = data;
    populateSidebarList(userTemplate, connectedUsers.filter( user => user._id !== me._id));
})