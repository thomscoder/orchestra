import React, { Component } from 'react';
import { shareScreenRecording, startScreenRecording, stopScreenRecording, stopScreenSharing } from '../../scripts/ScreenCapture';
import "../../styles/_ScreenCapture.scss";
import Peer from "peerjs";

import io from "socket.io-client";
const peer = new Peer({
    host: 'localhost',
    port: 5003,
    path: '/'
});

declare const process: {
    env: {
        REACT_APP_ENDPOINT: string
    }
}

const socket = io(process.env.REACT_APP_ENDPOINT);

interface State {
    peerId: string;
    users: any;
}
interface Props {
    userID: string;
}
export default class ScreenCapture extends Component<Props, State> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private videoSecondRef: React.RefObject<HTMLVideoElement>;
    private options: Object;
    public peer: any;
    constructor(props?: any) {
        super(props);
        this.state = {
            peerId: '',
            users: '',
        }
        this.options = {
            video: {
                cursor: "always",
            },
            audio: false,
        };
        this.videoRef = React.createRef();
        this.videoSecondRef = React.createRef();
        this.shareRecording = this.shareRecording.bind(this);
        this.stopSharing = this.stopSharing.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }
    componentDidMount() {
        console.log("PEER", peer);
        socket.emit("join-room", peer.id);
        this.setState({
            peerId: peer.id,
        })
        socket.on("joined-room", (users) => {
            this.setState({
                users:users,
            })
        })
        startScreenRecording(this.options).then((stream) => {
            this.videoRef.current!.srcObject = stream!;
            peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    console.log(data);
                });
                conn.on('open', () => {
                    conn.send('hello!');
                    peer.call(this.state.users, stream!);
                });
            });
        });
        
    }
    componentDidUpdate() {
        
    }


    shareRecording() {
        shareScreenRecording(this.videoSecondRef.current, this.videoRef.current, this.options); 
    }
    
    stopSharing() {
        stopScreenSharing(this.videoSecondRef.current)
    }

    stopRecording() {
        stopScreenRecording(this.videoRef.current)
    }

    render() {
        return (
            <div>
                <video id="share-video" ref={this.videoRef} autoPlay></video>
                <div className="buttons">
                    <button type="button" onClick={this.shareRecording}>Invite people to join session</button>
                    <button type="button" onClick={this.stopSharing}>Stop sharing</button>
                    <button type="button" onClick={this.stopRecording}>Stop recording</button>
                </div>
                <React.Fragment>
                    <p id="room-id">Room ID: {this.state.peerId}</p>
                    <p id="new-user">New user joined: {this.state.users} </p>
                </React.Fragment>
            </div>
        )
    }
}
