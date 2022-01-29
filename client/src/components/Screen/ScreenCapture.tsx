import React, { Component } from 'react';
import { startScreenRecording, stopScreenRecording} from '../../scripts/ScreenCapture';
import "../../styles/_ScreenCapture.scss";

interface State {
    peerId: string;
    users: any;
    answerReqControlMessage: Boolean;
    connection: any;
}
interface Props {
    userID: string;
    socket?: any;
    peer?: any;
}
export default class ScreenCapture extends Component<Props, State> {
    private videoRef: React.RefObject<HTMLVideoElement>;
    private options: Object;
    public peer: any;
    constructor(props?: any) {
        super(props);
        this.state = {
            peerId: '',
            users: '',
            answerReqControlMessage: false,
            connection: undefined,
        }
        this.options = {
            video: {
                cursor: "always",
            },
            audio: false,
        };
        this.videoRef = React.createRef();
        this.stopRecording = this.stopRecording.bind(this);
        this.acceptedControl = this.acceptedControl.bind(this);
        this.refusedControl = this.refusedControl.bind(this);
        
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
                this.setState({
                    connection: conn,
                })
                conn.on('open', () => {
                    conn.on('data', (data) => {
                        // If data is request control message then activate the "popup"
                        if(data.event == "stop control") {
                            this.state.connection.send({reqControl: "no"})
                            this.setState({
                                answerReqControlMessage: false,
                            });
                            return;
                        }
                        if(data.event == "request control") {
                            this.setState({
                                answerReqControlMessage: true,
                            });
                            return;
                        }
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
    
    acceptedControl() {
        this.state.connection.send({reqControl: 'yes'})
        this.setState({
            answerReqControlMessage: false,
        })
    }

    refusedControl() {
        this.state.connection.send({reqControl: 'no'})
        this.setState({
            answerReqControlMessage: false,
        })
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
                    {
                    this.state.answerReqControlMessage ?
                    <React.Fragment>
                        <p>User {this.state.users} requested to take control</p>
                        <button type="submit" value="yes" onClick={this.acceptedControl}>Yes</button>
                        <button type="submit" value="no" onClick={this.refusedControl}>No</button>
                    </React.Fragment> 
                    : null
                    }
                </React.Fragment>
            </div>
        )
    }
}
