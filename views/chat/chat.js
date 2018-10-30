// Connect to server socket
const socket        = io.connect('http://localhost:8080');

// Query DOM
const message       = document.getElementById('message'),
      feedback      = document.getElementById('feedback');


let handle          = '';
let me              = {};
let room            = {};
let lastHandle      = '';
let lastMessageId   = '';
let connected_users = [];

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

let populateUserlist = function() {
    let sidebar = document.getElementById('sidebar-list');

    let userPanel = (user) => {
        let panel = document.createElement('div');
        panel.className = 'detail';
        panel.innerHTML = `
            <a href="#">
                <h3>${user.username}</h3>
            </a>
        `;

        panel.addEventListener('click', () => {
            socket.emit('private_room', {
                to: user,
                from: me
            })
        });

        return panel;
    }

    sidebar.innerHTML = '';

    connected_users.forEach((user) => {
        insertAfter(sidebar, userPanel(user));
    })
}

// Get profile information
$.ajax({
    url:'http://localhost:8080/user_info',
    type: 'GET',
    dataType: 'json',
    success: (res) => {
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


// Listen for socket events
socket.on('room_joined', data => {
    room = data;
    socket.emit("get_messages", room);
});

socket.on('chat_history', data => {
    data.messages.forEach((message) => {
        postMessage(message);
    });
})

socket.on('chat', data => {
    postMessage(data);
    // if (data.user.username === lastHandle && lastMessageId !== "")
    //  addMessage(lastMessageId, data.message);
    // else
    //  addNewMessage(data.user.username === me.username, data);
});

socket.on('users', data => {
    connected_users = data.filter((user) => {
        return user.username !== handle;
    });

    populateUserlist(connected_users);
})