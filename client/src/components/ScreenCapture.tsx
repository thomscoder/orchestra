import React, { Component } from 'react';
import { startScreenRecording, stopScreenRecording } from '../scripts/ScreenCapture';
import "../styles/_ScreenCapture.css";


export default class ScreenCapture extends Component {
    public videoRef: React.RefObject<HTMLVideoElement>;
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
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    startRecording() {
        startScreenRecording(this.videoRef.current, this.options)
    }

    stopRecording() {
        stopScreenRecording(this.videoRef.current)
    }
    render() {
        return (
            <div>
                <video id="video" ref={this.videoRef} autoPlay></video>
                <div className="buttons">
                    <button type="button" onClick={this.startRecording}>Start recording</button>
                    <button type="button" onClick={this.stopRecording}>Stop recording</button>
                </div>
            </div>
        )
    }
}
