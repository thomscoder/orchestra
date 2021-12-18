const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const {PeerServer} = require('peer');
const { Server } = require('socket.io');


dotenv.config();

const PORT = process.env.PORT || 5001
const app = express();

app.use(cors());
app.use(express.static("./client/build"));
app.use("*",(req, res) => {
    res.send(res.sendFile(path.join(__dirname, "client", "build", "index.html")))
})

const peerServer = PeerServer({
    port: 5003,
    path: '/'
})
const server = http.createServer(app);

const io = new Server(server, {
    cors: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"]
});

let users = [];
io.on("connection", (socket) => {
    socket.on("join-room", (room, id) => {
        socket.join(room);
        if(id) users.unshift(id);
        socket.broadcast.emit("joined-room", users[0]);
        console.log(`New user ${socket.id} joined the room ${room}`);
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("User disconnected");
    })
})


server.listen(PORT, () => {
    console.log("Server is up and running on port 5002");
});

