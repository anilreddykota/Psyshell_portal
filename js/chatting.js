const socket = io('https://atman.onrender.com');


if(!getParams()['uid']){
    console.log('Please');
    // window.location.href = '/groups.html';
}

function getParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split("&");
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
}

function join() {
    const params = getParams();
    const uid = params['uid'];
    const uname = params['uname'];
    document.getElementById('chatuname').textContent = uname?.toUpperCase();

    const data = {  
        sender: localStorage.puid,
        receiver: uid,
    }
    socket.emit('join', data);
    socket.emit('getPreviousMessages', data);
   
}

function appendMessage(message) {
    const chatBox = document.querySelector('.chatting-area');

    // Create li element for the message
    const messageElement = document.createElement('li');

    // Apply different classes based on the sender's UID
   
    // Create figure element for the user avatar
    const figureElement = document.createElement('figure');
    const imgElement = document.createElement('img');
    
    // Update the image source based on sender or receiver
    imgElement.alt = ""; // Set alt attribute if needed
    if (message.sender === localStorage.puid) {
        messageElement.classList.add('me');
        imgElement.src = "images/resources/userlist-1.jpg";
    } else {
        messageElement.classList.add('you');
        imgElement.src = "images/resources/friend-avatar.jpg";
    }
    figureElement.appendChild(imgElement);

    // Create p element for the message text
    const pElement = document.createElement('p');
    pElement.textContent = message.text;

    // Append figure and p elements to the message element
    messageElement.appendChild(figureElement);
    messageElement.appendChild(pElement);

    // Append the message element to the chat box
    chatBox.appendChild(messageElement);

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
}





socket.on('previousmessages', (data) => {
    console.log('previousmessages', data);
    data.forEach(message => {
        appendMessage(message)
    });
});


// Function to send a message to the server
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    const data = {
        sender: localStorage.puid,
        receiver: getParams()['uid'],
        text: message
    }
    if (message !== '') {
        socket.emit('newmessage', data);
        messageInput.value = '';
        appendMessage(data);
    }
}

// Event listener for receiving messages from the server
socket.on('newmessage', (message) => {
    console.log('received', message);
    appendMessage(message);
});
