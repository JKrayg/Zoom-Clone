const express = require("express");
//const routes = require("./routes/API");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server)
const fs = require('fs');
const { PeerServer } = require('peer');
const { v4: uuidV4 } = require("uuid")
const PORT = process.env.PORT || 3000;

// if(PORT === process.env.PORT) {
//     // const peerServer = PeerServer({
//     //     host: 'agile-shore-99216.herokuapp.com',
//     //     port: process.env.PORT || 9000,
//     //     ssl: {
//     //     key: fs.readFileSync('server.key', "utf8"),
//     //     cert: fs.readFileSync('server.csr', "utf8")
//     //     }
//     // });
//     const peerServer = PeerServer({ port: 9000, path: 'agile-shore-99216.herokuapp.com' });
//     app.use('agile-shore-99216.herokuapp.com', peerServer);
// }



app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.redirect(`/${ uuidV4() }`)
})

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room })
})

io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) => {
        console.log("User " + userId + " has connected to room " + roomId )
        socket.join(roomId)
        socket.to(roomId).broadcast.emit("user-connected", userId)

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId)
        })
    })
})

server.listen(PORT)

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());


// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"));
// }

//app.use(routes)

// app.listen(PORT, () => {
//     console.log("Server on localhost:" + PORT)
// })