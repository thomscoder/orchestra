const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const {v4} = require("uuid");
const { Server } = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 5001
const app = express();

app.use(cors());
app.use(express.static("./client/build"));
app.use("*",(req, res) => {
    res.send(res.sendFile(path.join(__dirname, "client", "build", "index.html")))
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"]
});


io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
        socket.join(room.room);
        socket.broadcast.emit("joined-room", room.userId);
        console.log(`New user ${socket.id} joined the room ${room.room}`);
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("User disconnected");
    })
})


server.listen(PORT, () => {
    console.log("Server is up and running on port 5002");
});

