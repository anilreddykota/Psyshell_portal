const socket = io('https://atman.onrender.com');
// const socket = io('http://localhost:3002');


if(!getParams()['uid']){
    console.log('Please');
    // window.location.href = '/groups.html';
}

var uid = getParams()['uid'];
var puid = localStorage.puid;

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
    figureElement.style.height = '52px';
    figureElement.style.width = '52px';
   
    const imgElement = document.createElement('img');
    imgElement.style.height = '30px';
    imgElement.style.width = '30px';
    imgElement.style.objectFit = 'cover';
    // Update the image source based on sender or receiver
    imgElement.alt = ""; // Set alt attribute if needed
    if (message.sender === localStorage.puid) {
        messageElement.classList.add('me');
        imgElement.src = `https://firebasestorage.googleapis.com/v0/b/psycove-4ebf5.appspot.com/o/profilepics%2F${puid}?alt=media`||'./images/resources/defaultpic.jpeg';
    } else {
        messageElement.classList.add('you');
        imgElement.src = `https://firebasestorage.googleapis.com/v0/b/psycove-4ebf5.appspot.com/o/profilepics%2F${uid}?alt=media`||'./images/resources/defaultpic.jpeg';
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
        sender: localStorage.puid,
        receiver: getParams()['uid'],
        text: message
    }
    if (message !== '') {
        socket.emit('newmessage', data);
        messageInput.value = '';
        appendMessage(data);
    }else{
        showToast("enter message !","red")
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


function showToast(message,color) {
    const messageToast = document.getElementById('messageToast');
    messageToast.innerText = message;
    messageToast.style.backgroundColor = color;
    messageToast.style.display = 'block'; // Show the message
    setTimeout(() => {
      closeToast(); // Automatically close after 5 seconds
    }, 5000);
  }
  
  // Function to close the toast message
  function closeToast() {
    const messageToast = document.getElementById('messageToast');
    messageToast.style.animation = 'slideOutRight 1s forwards'; // Animation for exit
    setTimeout(() => {
      messageToast.style.display = 'none'; // Hide the message after animation
      messageToast.style.animation = ''; // Reset animation
    }, 500); // Wait for animation to complete
  }


  function opencall() {
    const params = getParams();
    const sender = localStorage.puid;
    const receiver = params['uid'];
    window.open(`callwindow.html?receiver=${receiver}&sender=${sender}`, 'CallWindow', 'width=600,height=400');
}
