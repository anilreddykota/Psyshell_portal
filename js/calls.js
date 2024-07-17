const socket = io("https://atman.onrender.com");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
const muteButton = document.getElementById("mute-btn");
const videoButton = document.getElementById("video-close");

let peerConnection;
let localStream;

document.addEventListener("DOMContentLoaded", () => {
    createPeerConnection();
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream;
            localVideo.srcObject = stream;
            stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        })
        .catch((error) => console.error("Error accessing media devices:", error));
});

function createPeerConnection() {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
            handleICECandidateEvent(event);
        }
    });
    peerConnection.addEventListener('track', event => {
        if (event.streams) {
            handleTrackEvent(event);
        }
    });
}

function handleICECandidateEvent(event) {
    if (event.candidate) {
        const params = getParams();
        const sender = params["sender"];
        const receiver = params["receiver"];
        
        socket.emit("iceCandidate", { candidate: event.candidate, sender, receiver });
    }
}

function handleTrackEvent(event) {
    if (!remoteVideo.srcObject) {
        remoteVideo.srcObject = event.streams[0];
    }
}

function getParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split("&");
    pairs.forEach(pair => {
        const [key, value] = pair.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
}

function initiateCall() {
    const params = getParams();
    const sender = params["sender"];
    const receiver = params["receiver"];

    peerConnection.createOffer()
        .then((offer) => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            socket.emit("offer", { connection: peerConnection.localDescription, sender, receiver });
        })
        .catch((error) => {
            console.error('Error creating offer.', error);
        });
}

socket.on("offer", async (offer) => {
  const params = getParams();
  const sender = params["sender"];
  const receiver = params["receiver"];
  createPeerConnection();

  if (confirm("Incoming call. Do you want to accept?")) {
      try {
          await peerConnection.setRemoteDescription(offer.connection);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          // Add local tracks to peer connection
          localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

          socket.emit("answer", { connection: peerConnection.localDescription, sender, receiver });
      } catch (error) {
          console.error("Error accepting call:", error);
      }
  } else {
      socket.emit("decline", { sender, receiver });
  }
});

socket.on("decline", () => {
    alert("The call has been declined by the other party.");
});

socket.on("answer", async (answer) => {
    try {
        await peerConnection.setRemoteDescription(answer);
    } catch (error) {
        console.error("Error setting remote description:", error);
    }
});

socket.on("iceCandidate", async (candidate) => {
    try {
        await peerConnection.addIceCandidate(candidate);
    } catch (error) {
        console.error("Error adding received ice candidate", error);
    }
});

socket.on("alert", (data) => {
    alert(data.message);
});

function join() {
    const params = getParams();
    const sender = params["sender"];
    const receiver = params["receiver"];
    socket.emit("join", { sender, receiver });
}

function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
        const params = getParams();
        const sender = params["sender"];
        const receiver = params["receiver"];
        socket.emit("decline", { sender, receiver });
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function toggleMute() {
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            muteButton.textContent = track.enabled ? "Mute" : "Unmute";
        });
    }
}

function toggleVideo() {
    if (localStream) {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            videoButton.textContent = track.enabled ? "Stop Video" : "Start Video";
        });
    }
}
