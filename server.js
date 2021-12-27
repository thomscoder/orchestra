#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');
const { PeerServer } = require('peer');
const { Server } = require('socket.io');
const robot = require('robotjs');
const fs = require('fs');


dotenv.config();

const PORT = process.env.PORT || 5001
const app = express();

// HTTPS local certificates
const certKey = "./certificates/"+process.env.CERTKEY
const certIp = "./certificates/"+process.env.CERT

const options = {
    key: fs.readFileSync(certKey),
    cert: fs.readFileSync(certIp),
}

app.use(cors({
    origin: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
}));


const peerServer = PeerServer({
    port: process.env.P_PORT,
    path: '/',
    ssl: {
        key: fs.readFileSync(certKey),
        cert: fs.readFileSync(certIp),
    }
})

// Start https server
const server = https.createServer(options, app);

const io = new Server(server, {
    cors: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
});

let users = [];
io.on("connection", (socket) => {
    socket.on("join-room", (room, id) => {
        socket.join(room);
        console.log(id);
        socket.broadcast.emit("joined-room", id);
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

// app.use(express.static("./client/build"));
// app.use("*",(req, res) => {
//     res.send(res.sendFile(path.join(__dirname, "client", "build", "index.html")))
// })

server.listen(PORT, () => {
    console.log("Server is up and running on port",PORT);
    console.log(`Serving your project at: https://192.168.1.5:${PORT}`);
    console.log(`Connect from any device in your network by typing: https://${process.env.HOST}:${PORT}`);
});

