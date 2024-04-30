const socket = io('https://atman.onrender.com');
// const socket = io('http://localhost:3002');


if(!getParams()['puid']){
    window.location.href = '/groups.html';
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
    const puid = params['puid'];
    const uname = params['uname'];
    document.getElementById('chatuname').textContent = uname?.toUpperCase();

    const data = {  
        sender: localStorage.uid,
        receiver: puid,
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
    if (message.sender === localStorage.uid) {
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
    data.forEach(message => {
        appendMessage(message)
    });
});


// Function to send a message to the server
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    const data = {
        sender: localStorage.uid,
        receiver: getParams()['puid'],
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
    appendMessage(message);
});


document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});



function opencall() {
    const params = getParams();
    const sender = localStorage.uid;
    const receiver = params['puid'];
    window.open(`callwindow.html?puid=${puid}`, 'CallWindow', 'width=600,height=400');
}

