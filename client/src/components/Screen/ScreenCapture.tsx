import React, { Component } from 'react';
import { startScreenRecording, stopScreenRecording} from '../../scripts/ScreenCapture';
import "../../styles/_ScreenCapture.scss";

interface State {
    peerId: string;
    users: any;
}
interface Props {
    userID: string;
    socket?: any;
    peer?: any;
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
        this.stopRecording = this.stopRecording.bind(this);
    }
    componentDidMount() {
        console.log("peer",this.props.peer);
        this.videoRef.current!.style.width = window.screen.width+'px';
        this.videoRef.current!.style.height = window.screen.height+'px';
        
        this.setState({
            peerId: this.props.peer.id,
        })
        startScreenRecording(this.options).then((stream) => {
            this.videoRef.current!.srcObject = stream!;
            this.props.peer.on('connection', (conn) => {
                console.log("peer detected")
                conn.on('open', () => {
                    conn.on('data', (data) => {
                        this.props.socket.send(JSON.stringify(data));
                        conn.send('Data ok!');
                        if(!data.event || (data.event !== 'mousemove' && data.event !== 'mouse-click' && data.event !== 'type')) this.props.peer.call(data.userId, stream!);
                        this.setState({
                            users: data.userId
                        })
                    });
                });
            });
        });
        
    }
    componentDidUpdate() {
        
    }



    stopRecording() {
        stopScreenRecording(this.videoRef.current)
    }

    render() {
        return (
            <div>
                <video id="share-video" ref={this.videoRef} autoPlay></video>
                <div className="buttons">
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
