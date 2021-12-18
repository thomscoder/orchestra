import React, { Component } from 'react';
import { shareScreenRecording, startScreenRecording, stopScreenRecording, stopScreenSharing } from '../../scripts/ScreenCapture';
import "../../styles/_ScreenCapture.scss";

import io from "socket.io-client";

declare const process: {
    env: {
        REACT_APP_ENDPOINT: string
    }
}

const socket = io(process.env.REACT_APP_ENDPOINT);

interface Props {
    userID: string;
    tokenId: string;
}
export default class ScreenCapture extends Component<Props> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private videoSecondRef: React.RefObject<HTMLVideoElement>;
    private options: Object;
    constructor(props?: any) {
        super(props);
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
        const payload = {
            room: this.props.tokenId,
        }
        socket.emit("join-room", payload)
        startScreenRecording(this.options).then((stream) => {
            //@ts-ignore
            this.videoRef.current!.srcObject = stream;
        });
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
                    <p id="user-id">Your ID: {this.props.userID}</p>
                    <p id="room-id">Room ID: {this.props.tokenId}</p>
                </React.Fragment>
            </div>
        )
    }
}
