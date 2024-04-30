


// Get video elements
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');


let peerConnection;

function createPeerConnection() {
    // Initialize peer connection
    peerConnection = new RTCPeerConnection();

    // Add event handlers
    peerConnection.onicecandidate = handleICECandidateEvent;
    peerConnection.ontrack = handleTrackEvent;
}

function handleICECandidateEvent(event) {
    if (event.candidate) {
        // Send ICE candidate to the other peer
        socket.emit('iceCandidate', event.candidate);
    }
}

function handleTrackEvent(event) {
    // Display remote video stream
    const remoteVideoElement = document.getElementById('remote-video');
    remoteVideoElement.srcObject = event.streams[0];
}

function initiateCall() {
    const params = getParams();
    const sender = localStorage.uid;
    const receiver = params['puid'];
    openCallWindow(receiver);
    createPeerConnection();
console.log(localVideo)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        console.log(localVideo,stream);

    })
    .catch(error => console.error('Error accessing media devices:', error));

    // Create offer
    peerConnection.createOffer()
        .then(offer => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            socket.emit('offer',{ connection:peerConnection.localDescription,sender, receiver});
        })
        .catch(error => {
            console.error('Error creating offer:', error);
        });
}

// Function to accept an incoming call
function acceptCall() {
    createPeerConnection();

    // Handle offer from the other peer
    socket.on('offer', (offer) => {
        peerConnection.setRemoteDescription(offer)
            .then(() => {
                // Create answer
                return peerConnection.createAnswer();
            })
            .then(answer => {
                return peerConnection.setLocalDescription(answer);
            })
            .then(() => {
                // Send answer to the other peer
                socket.emit('answer', peerConnection.localDescription);
            })
            .catch(error => {
                console.error('Error creating answer:', error);
            });
    });
}

// Function to reject an incoming call
function rejectCall() {
    // Send rejection to the other peer
    socket.emit('rejectCall');
}

// Event listener for incoming call notification
socket.on('incomingCall', (callData) => {
    // Display UI notification for incoming call
});

// Initialize peer connection








function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    localVideo.srcObject.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}
