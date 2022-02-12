import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";

interface Props {
    tokenId: string;
    socket?: any;
    peer?: any;
}
interface State {
    connection: any;
    allowedRemoteControl: Boolean;
}

export default class WatchScreen extends Component<Props, State> {
    private getScreenRef: RefObject<HTMLVideoElement>
    constructor(props) {
        super(props);
        this.state  = {
            connection: undefined,
            allowedRemoteControl: false,
        }
        this.getScreenRef = React.createRef();
        this.requestControl = this.requestControl.bind(this);
        this.stopControl = this.stopControl.bind(this);
    }
    componentDidMount() {
        this.props.peer.on("open", () => {
            // Start the connection with the peer
            let connection = this.props.peer.connect(this.props.tokenId);
            console.log("connection",connection, this.props.peer.id, this.props.tokenId);
            // Handle connection events
            // On errors
            this.props.peer.on("error",(err) => {
                console.log(err)
            });
            // On open
            const userData = {
                room: this.props.tokenId,
                userId: this.props.peer.id
            }
            connection.on('open', () => {
                connection.send(userData);
            });
            connection.on("data", (data) => {
                console.log(data);
                this.setState({
                    connection: connection,
                })
            })
            // Answer the call
            // Start receiving the data
            this.props.peer.on('call', (call) => {
                call.answer();
                call.on("stream",(incomingStream) => {
                    this.getScreenRef.current!.srcObject = incomingStream;
                })
            })
            
        })
    }

    requestControl = () => {
        let reqControlObj = {event: "request control"}
        this.state.connection!.send(reqControlObj)
        this.state.connection!.on("data", (data) => {

            if(data!.reqControl == 'yes') {
                // Only send events if url different than localhost (to not alter development)
                if(!window.location.href.match(/localhost/)) {
                    this.getScreenRef.current!.addEventListener("mousemove",(e) => {
                        const node = e.target as HTMLElement;
                        const rect = node.getBoundingClientRect();
                        let x = e.pageX - rect.left;
                        let y = e.pageY - rect.top;
                        const data = {event:"mousemove",posX: x, posY: y}
                        this.state.connection.send(data)
                    })
                }

                this.getScreenRef.current!.addEventListener("click", (e) => {
                    const target = e.target as HTMLElement;
                    const targetRect = target.getBoundingClientRect();

                    const x = e.clientX - targetRect.left;
                    const y = e.clientY - targetRect.top;
                    const data = {event: "mouse-click",x: x, y: y, room: this.props.tokenId, leftOrRight: e.which}
                    
                    this.state.connection.send(data)
                })
                
                document.addEventListener("keydown", (e) => {
                    let obj = {event: "type",key: e.key};
                    this.state.connection.send(obj)
                })
            }
        })
    }

    stopControl() {
        this.state.connection.send({event: "stop control"})
        this.state.connection!.on("data",(data) => {
            if(data!.reqControl == 'no') {
                this.setState({
                    allowedRemoteControl: false,
                })
            }
        })
    }


    componentDidUpdate() {
            

    }

    render() {
        return (
            <div>
                <video id="share-video" ref={this.getScreenRef} autoPlay></video>
                <button onClick={this.requestControl}>Request control</button>
                {
                    this.state.allowedRemoteControl ?
                    <button onClick={this.stopControl}>Stop control</button>
                    : null
                }
            </div>
        )
    }
}
