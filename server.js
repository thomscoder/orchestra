#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const https = require('https');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { mouse, Point, straightTo, keyboard, Key } = require("@nut-tree/nut-js");
const fs = require('fs');


dotenv.config();

const PORT = process.env.PORT || 5001
const app = express();

// HTTPS local certificates
const certKey = "./certificates/"+process.env.CERTKEY;
const certIp = "./certificates/"+process.env.CERT;

const options = {
    key: fs.readFileSync(certKey),
    cert: fs.readFileSync(certIp),
}

app.use(cors({
    origin: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
}));

// Start https server
const server = https.createServer(options, app);

const io = new Server(server, {
    cors: "*",
    methods: ["GET", "POST","PUT","PATCH","DELETE"],
});

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("join-room", (room, id) => {
        socket.join(room);
        socket.emit("joined-room", id);
        console.log(`New user ${id} joined the room ${room}`);
    });

    socket.on("mousemove", (data) => {
        let x = data.x;
        let y = data.y;
        let point = new Point(x, y);
        mouse.move(straightTo(point));
    })

    socket.on("mouse-click", (data) => {
        switch(data.leftOrRight) {
            case 1: mouse.leftClick();
            break;
            case 3: mouse.rightClick();
            break;
            default: mouse.leftClick();
            break;
        }
        socket.broadcast.emit("mouse-click", data);
    }) 
    socket.on("type", (data) => {
        switch(data.key) {
            case "ArrowLeft": keyboard.pressKey(Key.Left)
            break;
            case "ArrowRight": keyboard.pressKey(Key.Right);
            break;
            case "ArrowUp": keyboard.pressKey(Key.Up);
            break;
            case "ArrowDown": keyboard.pressKey(Key.Down);
            break;
            case "Enter": keyboard.pressKey(Key.Enter);
            break;
            case "Backspace": keyboard.pressKey(Key.Backspace);
            break;
            default: keyboard.pressKey(data.key);
        }
        socket.broadcast.emit("type", data);
    }) 

    socket.on("disconnect", () => {
        socket.broadcast.emit("User disconnected");
    })
})

server.listen(PORT, () => {
    console.log("Server is up and running on port",PORT);
    console.log(`Paste it in the 'Connect to server' field: https://${process.env.HOST}:${PORT}`);
});

