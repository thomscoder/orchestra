import React, { Component } from 'react';
import { shareScreenRecording, startScreenRecording, stopScreenRecording, stopScreenSharing } from '../../scripts/ScreenCapture';
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
    private socket: any;
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
        this.props.socket.emit("join-room", this.props.peer!._id);
        this.videoRef.current!.style.width = window.screen.width+'px';
        this.videoRef.current!.style.height = window.screen.height+'px';
        
        this.setState({
            peerId: this.props.peer.id,
        })
        this.props.socket.on("joined-room", (user) => {
            console.log(user);
            this.setState({
                users:user,
            })
        })
        startScreenRecording(this.options).then((stream) => {
            this.videoRef.current!.srcObject = stream!;
            this.props.peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    console.log(data);
                    this.props.peer.call(this.state.users, stream!);
                });
                conn.on('open', () => {
                    conn.send('Data ok!');
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
