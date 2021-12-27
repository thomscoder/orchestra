import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";
import io from "socket.io-client";
import Peer from "peerjs";

interface Props {
    tokenId: string;
    socket?: any;
    peer?: any;
}

export default class WatchScreen extends Component<Props> {
    private getScreenRef: RefObject<HTMLVideoElement>
    constructor(props) {
        super(props);
        this.getScreenRef = React.createRef();
    }
    componentDidMount() {
        let connection = this.props.peer.connect(this.props.tokenId);
        console.log(this.props.peer, this.props.peer.id);
        this.props.socket.emit("join-room", this.props.tokenId, this.props.peer.id);
        connection.on('open', () => {
            connection.send("Hello");
        });
        connection.on("data", (data) => {
            console.log(data);
        })
        this.props.peer.on('call', (call) => {
            call.answer();
            call.on("stream",(incomingStream) => {
                this.getScreenRef.current!.srcObject = incomingStream;
            })
        })
        if(!window.location.href.match(/localhost/)) {
            this.getScreenRef.current!.addEventListener("mousemove",(e) => {
                const node = e.target as HTMLElement;
                const rect = node.getBoundingClientRect();
                let x = e.pageX - rect.left;
                let y = e.pageY - rect.top;
                const data = {x, y}
                this.props.socket.emit("mousemove",data)
            })
        }

        this.getScreenRef.current!.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const targetRect = target.getBoundingClientRect();

            const x = e.clientX - targetRect.left;
            const y = e.clientY - targetRect.top;
            const data = {x: x, y: y, room: this.props.tokenId, leftOrRight: e.which}
            
            this.props.socket.emit("mouse-click", data)
        })
        document.addEventListener("keyup", (e) => {
            let obj = {key: e.key, room: this.props.tokenId};
            this.props.socket.emit("type", obj)
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
