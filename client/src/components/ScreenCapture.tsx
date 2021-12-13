import React, { Component } from 'react';
import { shareScreenRecording, startScreenRecording, stopScreenRecording, stopScreenSharing } from '../scripts/ScreenCapture';
import "../styles/_ScreenCapture.css";


export default class ScreenCapture extends Component {
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
        }
        this.videoRef = React.createRef();
        this.videoSecondRef = React.createRef();
        this.startRecording = this.startRecording.bind(this);
        this.shareRecording = this.shareRecording.bind(this);
        this.stopSharing = this.stopSharing.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    startRecording() {
        startScreenRecording(this.videoRef.current, this.options)
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
                <video id="video" ref={this.videoRef} autoPlay></video>
                <video id="second-video" ref={this.videoSecondRef} autoPlay></video>
                <div className="buttons">
                    <button type="button" onClick={this.startRecording}>Start recording</button>
                    <button type="button" onClick={this.shareRecording}>Share recording</button>
                    <button type="button" onClick={this.stopSharing}>Stop sharing</button>
                    <button type="button" onClick={this.stopRecording}>Stop recording</button>
                </div>
            </div>
        )
    }
}
