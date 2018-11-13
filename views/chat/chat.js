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
let lastHandle      = '';
let lastMessageId   = '';
let connectedUsers  = {};

// helper functions
let insertAfter = function(ref, newEl) {
    ref.insertAdjacentElement('beforeend', newEl)
}

let addNewMessage = function(data) {
    lastMessageId = data._id;
    lastHandle    = data.user.username;

    let myMessage = data.user.username === me.username;

    let newMessage = `
        <div class="${myMessage ? "my-message" : "other-message"}">
            <div class="content" id=${data._id}>
                <div class="message">
                    <p>${data.message}</p>
                </div>
                <div class="username"><strong>${data.user.username}</strong></div>
            </div>
        </div>
    `;

    feedback.innerHTML += newMessage;
}

let addMessage = function(lastId, message) {
    let lastMessage = document.getElementById(lastId);

    // Create new message
    let newMessage = document.createElement('p');
    newMessage.innerHTML = message;

    // Insert message
    insertAfter(lastMessage.childNodes[1], newMessage);
}

let postMessage = function(message) {
    if (lastHandle === '')
        addNewMessage(message)
    else if (message.user.username === lastHandle && lastMessageId) {
        addMessage(lastMessageId, message.message);
    }
    else 
        addNewMessage(message)
}

let populateRooms = function(data) {
    let sidebar = document.getElementById('sidebar-content');
    sidebar.innerHTML = '';

    let myConvoLabel  = document.createElement('label');
    myConvoLabel.innerHTML = 'My Conversations';

    let myConvoList   = document.createElement('ul');
    myConvoList.setAttribute('id', 'my-conversations');

    let joinableLabel = document.createElement('label');
    joinableLabel.innerHTML = 'Joinable Conversations';

    let joinableList  = document.createElement('ul');
    joinableList.setAttribute('id', 'joinable-conversations');

    let myRooms       = data.mine;
    let joinableRooms = data.joinable;

    insertAfter(sidebar, myConvoLabel);
    myRooms.forEach( room => {
        insertAfter(myConvoList, roomTemplate(room, () => {
            socket.emit('get_messages', room)
        }));
    })
    insertAfter(myConvoList, CreateRoomTemplate());
    insertAfter(sidebar, myConvoList);

    insertAfter(sidebar, joinableLabel);
    joinableRooms.forEach( room => {
        insertAfter(joinableList, roomTemplate(room, () => {
            socket.emit('join', {
                user: me,
                room: room
            })
        }));
    })
    insertAfter(sidebar, joinableList);

}

let populateSidebarList = function(template, data) {
    let sidebar = document.getElementById('sidebar-content');
    let listContainer = document.createElement('ul');
    listContainer.setAttribute('id', 'sidebar-list');

    sidebar.innerHTML = '';



    data.forEach( d => {
        insertAfter(listContainer, template(d));
    })

    insertAfter(sidebar, listContainer);
}

// Template functions
let userTemplate = function(data) {
    let panel = document.createElement('li');
    panel.className = 'li-person';
    panel.innerHTML = `${data.username}`;

    panel.addEventListener('click', () => {
        socket.emit('private_room', {
            to: data,
            from: me
        });
    })

    return panel;
}

let roomTemplate = function(data, onClick) {
    let panel = document.createElement('li');
    let name  = data.name

    if(name === "") {
        name = data.participants.filter( (p) => p._id !== me._id)[0].username;
        
    }

    panel.className = 'li-conversation';
    panel.innerHTML = `${name}`;

    panel.addEventListener('click', onClick);

    return panel;
}

let CreateRoomTemplate = function() {
    let panel = document.createElement('li');
    panel.className = 'li-add';
    panel.innerHTML = 'Create';

    panel.addEventListener('click', () => {
        $(".modal").show();
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
    populateSidebarList(userTemplate, 
        connectedUsers[room._id].participants.filter( user => {
            return user._id !== me._id;
        })
    );
})

$('#newroom').submit((event) => {
    let roomName  = $('#roomname');
    let isPrivate = $('#isPrivate');

    socket.emit('create_room', {
        roomName : roomName.val(),
        isPublic : !isPrivate.is(':checked'),
        user     : me
    });
    
    roomName.val('');
    isPrivate.prop('checked', false);

    $(".modal").hide();
    event.preventDefault();
})

$(".modal").click(() => {
    $(".modal").hide();
})

$(".modal-content").click( e => {
    e.stopPropagation();
});


// Listen for socket events
socket.on('room_joined', data => {
    room = data;
    connectedUsers[room._id] = data;
    socket.emit('get_rooms', me._id);
    socket.emit("get_messages", data);
});

socket.on('rooms', data => {
    populateRooms(data);
})

socket.on('room_created', () => {
    socket.emit('get_rooms', me._id);
})

socket.on('chat_history', data => {
    feedback.innerHTML = '';
    lastHandle         = '';
    lastMessageId      = '';

    data.messages.forEach( message => {
        postMessage(message);
    });
})

socket.on('chat', data => {
    postMessage(data);
});

socket.on('users', data => {
    connectedUsers[data._id] = data;

    populateSidebarList(userTemplate, 
        connectedUsers[room._id].participants.filter( user => {
            return user._id !== me._id;
        })
    );
})