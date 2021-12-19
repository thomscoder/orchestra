import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";
import io from "socket.io-client";
import Peer from "peerjs";

//@ts-ignore
const socket = io(process.env.REACT_APP_ENDPOINT)
//@ts-ignore
const HOST = String(process.env.REACT_APP_HOST);
//@ts-ignore
const PORT = Number(process.env.REACT_APP_P_PORT);
const peer = new Peer({
    host: HOST,
    port: PORT,
    path: '/'
});

interface Props {
    tokenId: string;
}

export default class WatchScreen extends Component<Props> {
    private getScreenRef: RefObject<HTMLVideoElement>
    constructor(props) {
        super(props);
        this.getScreenRef = React.createRef();
    }
    componentDidMount() {
        let connection = peer.connect(this.props.tokenId)
        connection.on('open', () => {
            socket.emit("join-room", this.props.tokenId, peer.id);
            connection.send("Hello");
        });
        connection.on("data", (data) => {
            console.log(data);
        })
        peer.on('call', (call) => {
            call.answer();
            call.on("stream",(incomingStream) => {
                this.getScreenRef.current!.srcObject = incomingStream;
            })
        })
        this.getScreenRef.current!.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const targetRect = target.getBoundingClientRect();

            const x = e.clientX - targetRect.left;
            const y = e.clientY - targetRect.top;
            const data = {x: x, y: y, room: this.props.tokenId, leftOrRight: e.which}
            
            socket.emit("mouse-click", data)
        })
        document.addEventListener("keyup", (e) => {
            let obj = {key: e.key, room: this.props.tokenId};
            socket.emit("type", obj)
        })
    }

    componentDidUpdate() {
        
    }

    render() {
        return (
            <div>
                <video id="share-video" ref={this.getScreenRef} autoPlay></video>
            </div>
        )
    }
}
