import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";

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
        this.props.peer.on("open", () => {
            console.log("aefvjaenvaievniaeofvoaiefbvahefbvaefvbao")
            let connection = this.props.peer.connect(this.props.tokenId);
        console.log("connection",connection, this.props.peer.id, this.props.tokenId);
        this.props.peer.on("error",(err) => {
            console.log(err)
        });
        const userData = {
            room: this.props.tokenId,
            userId: this.props.peer.id
        }
        connection.on('open', () => {
            connection.send(userData);
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
                const data = {event:"mousemove",x, y}
                connection.send(data)
            })
        }

        this.getScreenRef.current!.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const targetRect = target.getBoundingClientRect();

            const x = e.clientX - targetRect.left;
            const y = e.clientY - targetRect.top;
            const data = {event: "mouse-click",x: x, y: y, room: this.props.tokenId, leftOrRight: e.which}
            
            connection.send(data)
        })
        document.addEventListener("keyup", (e) => {
            let obj = {event: "type",key: e.key, room: this.props.tokenId};
            connection.send(obj)
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
