const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { PeerServer } = require('peer');
const { Server } = require('socket.io');
const robot = require('robotjs');


dotenv.config();

const PORT = process.env.PORT || 5001
const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
}));


const peerServer = PeerServer({
    port: process.env.P_PORT,
    path: '/'
})
const server = http.createServer(app);

const io = new Server(server, {
    cors: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
});

let users = [];
io.on("connection", (socket) => {
    socket.on("join-room", (room, id) => {
        socket.join(room);
        if(id) users.unshift(id);
        socket.broadcast.emit("joined-room", users[0]);
        console.log(`New user ${socket.id} joined the room ${room}`);
    });

    socket.on("mousemove", (data) => {
        let x = data.x;
        let y = data.y;
        robot.moveMouse(x, y);
    })

    socket.on("mouse-click", (data) => {
        robot.moveMouse(data.x, data.y);
        if(data.leftOrRight == 1) robot.mouseClick();
        if(data.leftOrRight == 3) robot.mouseClick("right");
        socket.broadcast.emit("mouse-click", data);
    }) 
    socket.on("type", (data) => {
        let room = data.room;
        switch(data.key) {
            case "ArrowLeft": robot.keyTap("left");
            break;
            case "ArrowRight": robot.keyTap("right");
            break;
            case "ArrowUp": robot.keyTap("up");
            break;
            case "ArrowDown": robot.keyTap("down");
            break;
            case "Enter": robot.keyTap("enter");
            break;
            case "Backspace": robot.keyTap("backspace");
            break;
            default: robot.keyTap(data.key);
        }
        socket.broadcast.emit("type", data);
    }) 
    socket.on("disconnect", () => {
        socket.broadcast.emit("User disconnected");
    })
})

app.use(express.static("./client/build"));
app.use("*",(req, res) => {
    res.send(res.sendFile(path.join(__dirname, "client", "build", "index.html")))
})
server.listen(PORT, () => {
    console.log("Server is up and running on port"+PORT);
});

