const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const {Server} = require('socket.io');

dotenv.config();
const PORT = process.env.PORT || 5001
const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.static("./client/build"));

const io = new Server(server, {
    cors: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
});

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.on("videoSrc", (videoSrc) => {
        console.log(videoSrc);
    })
    io.on("disconnection",() => {
        console.log("disconnected")
    })
})

app.use("*",(req, res) => {
    res.send(res.sendFile(path.join(__dirname, "client", "build", "index.html")))
})

server.listen(PORT, () => {
    console.log("Server is up and running on port 5002");
})