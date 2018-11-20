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
let invitedRoom     = {};
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

    let addPerson = document.createElement('li');
    addPerson.innerHTML = `<span class="li-add">Invite</span>`;
    addPerson.addEventListener('click', () => {
        socket.emit("get_users");
    })

    insertAfter(listContainer, addPerson);
    insertAfter(sidebar, listContainer);
}

// Template functions
let userTemplate = function(data) {
    let panel = document.createElement('li');

    let user  = document.createElement('span');
    user.className = 'li-person';
    user.innerHTML = `${data.username}  `;
    user.addEventListener('click', () => {
        socket.emit('private_room', {
            to: data,
            from: me
        })
    })

    let kick  = document.createElement('span');
    kick.className = 'kick';
    kick.addEventListener('click', () => {

        socket.emit('kick', {
            room : room,
            admin: me,
            user : data
        })
    })

    insertAfter(panel, user);
    insertAfter(panel, kick);

    return panel;
}

let roomTemplate = function(data, onClick) {
    let panel = document.createElement('li');
    let name  = data.name

    if(name === "") {
        name = data.participants.filter( (p) => p._id !== me._id)[0].username;
        
    }
    panel.innerHTML = `<span class="li-conversation">${name}</span>`;

    panel.addEventListener('click', onClick);

    return panel;
}

let CreateRoomTemplate = function() {
    let panel = document.createElement('li');
    panel.innerHTML = '<span class="li-add">Create</span>';

    panel.addEventListener('click', () => {
        $("#create-room").show();
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

    $("#create-room").hide();
    event.preventDefault();
})

$("#accept").click(() => {
    socket.emit('accept', invitedRoom);
    $(".modal").hide();
})

$("#reject").click(() => {
    socket.emit('reject', invitedRoom);
    $(".modal").hide();
})

$(".modal").click(() => {
    $(".modal").hide();
})

$(".modal-content").click( e => {
    e.stopPropagation();
});


// Listen for socket events
socket.on('room_joined', data => {
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
    room = data.room;
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

socket.on('all_users', data => {
    let userListContainer = document.getElementById('people-modal');
    userListContainer.innerHTML = '';

    data.forEach( user => {
        let uPanel = document.createElement('li');
        uPanel.innerHTML = `<span class="li-person">${user.username}</span>`;

        uPanel.addEventListener('click', () => {
            socket.emit('invite', {
                room  : room,
                admin : me,
                user  : user
            })

            $(".modal").hide();
        })
        insertAfter(userListContainer, uPanel);
    })

    $("#user-lists").show();
})

socket.on('users', data => {
    connectedUsers[data._id] = data;

    populateSidebarList(userTemplate, 
        connectedUsers[room._id].participants.filter( user => {
            return user._id !== me._id;
        })
    );
})

socket.on('kick', data => {
    connectedUsers[room._id] = data;
    populateSidebarList(userTemplate, 
        connectedUsers[room._id].participants.filter( user => {
            return user._id !== me._id;
        })
    );
})

socket.on('request_join', data => {
    let {room, admin} = data;
    invitedRoom = room;

    let requestContent = document.getElementById('request-content');
    requestContent.innerHTML = `${admin.username} has invited you to join ${room.name}`;
    $("#request-join").show();
    
})