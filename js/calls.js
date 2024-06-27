const socket = io("https://atman.onrender.com");

// Get video elements
const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");


let peerConnection;
document.addEventListener("DOMContentLoaded", () => {
    createPeerConnection();
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localVideo.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    
    })
    .catch((error) => console.error("Error accessing media devices:", error));


});


function createPeerConnection() {
    console.log("Creating peer connection...");
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
    try {
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = handleICECandidateEvent;
        peerConnection.ontrack = handleTrackEvent;
        console.log("Peer connection created successfully.");
    } catch (error) {
        console.error("Error creating peer connection:", error);
    }
}



function handleICECandidateEvent(event) {
    console.log("ICE candidate event received:", event);
    if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit("iceCandidate", event.candidate);
    } else {
        console.log("No more ICE candidates to send.");
    }
}

function handleTrackEvent(event) {
  
    const remoteVideo = document.getElementById("remote-video");
    if (!remoteVideo.srcObject) {
      remoteVideo.srcObject = event.streams[0];
    }
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

function initiateCall() {
  const params = getParams();
  const sender = params["sender"];
  const receiver = params["receiver"];

  createPeerConnection();

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localVideo.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    })
    .catch((error) => console.error("Error accessing media devices:", error));

  peerConnection
    .createOffer()
    .then((offer) => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      socket.emit("offer", {
        connection: peerConnection.localDescription,
        sender,
        receiver,
      });
    })
    .catch((error) => {
      console.error("Error creating offer:", error);
    });
}


socket.on("offer", async (offer) => {
    
    const params = getParams();
    const sender = params["sender"];
    const receiver = params["receiver"];
    console.log(offer)
    createPeerConnection();
    if (confirm("Incoming call. Do you want to accept?")) {
      try {
        // Set the remote description
        await peerConnection.setRemoteDescription(offer.connection);
  
        // Create answer
        const answer = await peerConnection.createAnswer();
  
        // Set local description
        await peerConnection.setLocalDescription(answer);
  
        // Send answer to the other peer
        socket.emit("answer", {connection:peerConnection.localDescription,sender,receiver});
  
        // Once the call is accepted, add the remote stream to the remote video element
        peerConnection.ontrack = (event) => {
            console.log(event);
          const remoteVideo = document.getElementById("remote-video");
          if (!remoteVideo.srcObject) {
            remoteVideo.srcObject = event.streams[0];
          }
        };
      } catch (error) {
        console.error("Error accepting call:", error);
      }
    } else {
      
    
      const data = {
        sender: sender,
        receiver: receiver,
      };
      socket.emit("decline", data);
    }
  });
  
socket.on("decline", () => {
  alert("The call has been declined by the other party.");
  endCall();
});

socket.on("answer", async (answer) => {
    console.log(answer);
    try {
      // Set the remote description from the answer
      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.setRemoteDescription(remoteDesc);
     
      
      // Listen for the 'track' event to add remote video stream
      console.log(peerConnection,answer)
      peerConnection.ontrack = (event) => {
        if (!remoteVideo.srcObject) {
          remoteVideo.srcObject = event.streams[0];
        }
      };
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  });
  
socket.on("alert",(data)=>{
    alert(data.message)
})


function join() {
  const params = getParams();
  const sender = params["sender"];
  const receiver = params["receiver"];

  const data = {
    sender: sender,
    receiver: receiver,
  };
  socket.emit("join", data);
}

function endCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  localVideo.srcObject.getTracks().forEach((track) => track.stop());
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}
