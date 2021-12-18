import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";
import io from "socket.io-client";
import Peer from "peerjs";

//@ts-ignore
const socket = io(process.env.REACT_APP_ENDPOINT)
const peer = new Peer({
    host: 'localhost',
    port: 5003,
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
            console.log("stream prova", call)
            call.answer();
            call.on("stream",(incomingStream) => {
                this.getScreenRef.current!.srcObject = incomingStream;
                console.log("stream", incomingStream);
            })
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
