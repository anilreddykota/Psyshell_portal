const socket = io("https://atman.onrender.com");

const localVideo = document.getElementById("local-video");
const remoteVideo = document.getElementById("remote-video");
const muteButton = document.getElementById("mute-btn");
const videoButton = document.getElementById("video-close");
const callbtn = document.getElementById("call-btn");
const endbtn = document.getElementById("end-btn");
const incomingCallSound = document.getElementById("incoming-call-sound");
const speakerbtn = document.getElementById("speaker-btn");

let peerConnection;
let localStream;

document.addEventListener("DOMContentLoaded", () => {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream;
            localVideo.srcObject = stream;
        })
        .catch((error) => console.error("Error accessing media devices:", error));
        endbtn.style.display = "none";
});

function createPeerConnection() {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addEventListener('icecandidate', handleICECandidateEvent);
    peerConnection.addEventListener('track', handleTrackEvent);

    if (localStream) {
        localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    }
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
    if (remoteVideo.srcObject !== event.streams[0]) {
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
    callbtn.disabled = true;

    createPeerConnection();

    peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit("offer", { connection: peerConnection.localDescription, sender, receiver });
            callbtn.disabled = false;
            callbtn.style.display = "none";
            endbtn.style.display = "block";
        })
        .catch((error) => {
            console.error('Error creating offer.', error);
            callbtn.disabled = false;
        });
}

socket.on("offer", async (offer) => {
    const params = getParams();
    const sender = params["sender"];
    const receiver = params["receiver"];
    createPeerConnection();
    incomingCallSound.play();

    if (confirm("Incoming call. Do you want to accept?")) {
        try {
            await peerConnection.setRemoteDescription(offer.connection);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("answer", { connection: peerConnection.localDescription, sender, receiver });
            callbtn.style.display = "none";
            endbtn.style.display = "block";
            incomingCallSound.pause();

        } catch (error) {
            console.error("Error accepting call:", error);
        }
    } else {
        socket.emit("decline", { sender, receiver });
        console.log("called this");
        incomingCallSound.pause();

    }
});

socket.on("decline", () => {
    alert("The call has been declined by the other party.");
    callbtn.style.display = "block";
    endbtn.style.display = "none";
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
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    callbtn.style.display = "block";
    endbtn.style.display = "none";
    window.location.reload();
}
function toggleMute() {
    if (localStream) {
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            muteButton.innerHTML = track.enabled ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-mic" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
                </svg>` : 
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-mic-mute-fill" viewBox="0 0 16 16">
                    <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5.5v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3"/>
                    <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z"/>
                </svg>`;
        });
    }
}

function toggleVideo() {
    if (localStream) {
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            
            videoButton.innerHTML = track.enabled ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-camera-video" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.11-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm10.5 6h-8A1.5 1.5 0 0 1 1 9.5v-3A1.5 1.5 0 0 1 2.5 5h8A1.5 1.5 0 0 1 12 6.5v3a1.5 1.5 0 0 1-1.5 1.5z"/>
            </svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-camera-video-off" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z"/>
</svg>`;
        });
    }
}

async function switchCamera() {
    if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        if (videoTracks.length > 1) {
            const currentTrack = videoTracks[0];
            const nextTrack = videoTracks[1 % videoTracks.length];

            await currentTrack.stop();
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: nextTrack.getSettings().deviceId }
                }
            });

            localStream.removeTrack(currentTrack);
            localStream.addTrack(newStream.getTracks()[0]);
        }
    }
}


let isSpeakerEnabled = true; 

function toggleAudioOutput() {
    const audioOutput = isSpeakerEnabled ? 'earpiece' : 'speaker'; // Toggle between earpiece and speaker

console.log(remoteVideo)
    remoteVideo.setSinkId(audioOutput)
        .then(() => {
            if (speakerbtn) {
                speakerbtn.innerHTML = audioOutput === 'earpiece' ?
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ear-fill" viewBox="0 0 16 16">
  <path d="M8.5 0A5.5 5.5 0 0 0 3 5.5v7.047a3.453 3.453 0 0 0 6.687 1.212l.51-1.363a4.6 4.6 0 0 1 .67-1.197l2.008-2.581A5.34 5.34 0 0 0 8.66 0zM7 5.5v2.695q.168-.09.332-.192c.327-.208.577-.44.72-.727a.5.5 0 1 1 .895.448c-.256.513-.673.865-1.079 1.123A9 9 0 0 1 7 9.313V11.5a.5.5 0 0 1-1 0v-6a2.5 2.5 0 0 1 5 0V6a.5.5 0 0 1-1 0v-.5a1.5 1.5 0 1 0-3 0"/>
</svg>` :
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone" viewBox="0 0 16 16">
  <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z"/>
</svg>`;
            }

            isSpeakerEnabled = !isSpeakerEnabled;
        })
        .catch((error) => {
            console.error('Failed to change audio output:', error);
        });
}




callbtn.addEventListener("click", initiateCall);
endbtn.addEventListener("click", endCall);
muteButton.addEventListener("click", toggleMute);
videoButton.addEventListener("click", toggleVideo);

speakerbtn.addEventListener("click",toggleAudioOutput);
