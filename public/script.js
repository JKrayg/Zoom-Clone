const socket = io("/");
const videoGrid = document.getElementById("video-grid");
var myPeer = {};

// const myPeer = new Peer(undefined, {
//     host: '/',
//     port: '3001'
// })

// const herokuPeer = new Peer(undefined, {
//     host: 'agile-shore-99216.herokuapp.com/',
//     port: '443'
// })

console.log(window.location.href[7])

if (window.location.href[7] == "l")  {
    myPeer = new Peer(undefined, {
        host: '/',
        port: '3001',
        path: '/myapp'
    });
} else {
    myPeer = new Peer(undefined, {
        host: 'agile-shore-99216.herokuapp.com',
        port: '9001'
    });
}

const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}). then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on("call", call => {
        call.answer(stream)
        const video = document.createElement("video")

        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on("user-connected", userId => {
        connectToNewUser(userId, stream)
    })
})

socket.on("user-disconnected", userId => {
    if (peers[userId]) peers[userId].close();
})

myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on("close", () => {
        video.remove()
    })

    peers[userId] = call;
}


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    videoGrid.append(video);
}