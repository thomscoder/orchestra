import React, { Component} from 'react';
import ScreenCapture from '../Screen/ScreenCapture';
import WatchScreen from '../Screen/WatchScreen';
import "../../styles/_ScreenHomepage.scss"

import io from "socket.io-client";
import Peer from "peerjs";
import ShortUniqueId from "short-unique-id";
interface Props {
    login?: any;
}
const REACT_HOST = String(process.env.REACT_APP_HOST);
const REACT_PORT = Number(process.env.REACT_APP_PORT);

const uid = new ShortUniqueId({length: 4})

interface State {
    logged: Boolean;
    userID: string;
    getScreenId: string;
    socket: any;
    p_port: any;
    host: any;
}
export default class ScreenHomepage extends Component<Props, State> {
    private ipRef: React.RefObject<HTMLInputElement>;
    private getHost: React.RefObject<HTMLInputElement>;
    constructor(props?) {
        super(props);
        this.ipRef = React.createRef();
        this.getHost = React.createRef();
        this.state = {
            logged: false,
            getScreenId: '',
            userID: "",
            socket: undefined,
            host: undefined,
            p_port: undefined,
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
        this.startConnection = this.startConnection.bind(this);
    }

    startConnection(e) {
        e.preventDefault();
        const url = this.ipRef.current!.value
        const ipAddress: string = url.match(/(?<=\/\/).*(?=:)/)![0];
        const portNumber = url.match(/(?<=:)\d+/)![0];
        const socket = io(`https://${ipAddress}:${portNumber}`);

        this.setState({
            socket: socket,
            host: REACT_HOST,
            p_port: REACT_PORT,
        })

        console.log(socket);
    }

    getScreen(e) {
        e.preventDefault();
        const HOST =this.getHost.current!.value;
        this.setState({
            getScreenId: HOST.split('.').join(''),
            host: REACT_HOST,
            p_port: REACT_PORT,
        })
    }

    shareYourScreen(e) {
        e.preventDefault();
        this.setState({
            logged: true,
        });
    }

    render() {
        if(this.state.getScreenId !== '') {
            return (
                <WatchScreen 
                    tokenId={this.state.getScreenId}
                    socket={this.state.socket}
                    peer ={new Peer(uid(),{
                        host: REACT_HOST,
                        port: Number(REACT_PORT),
                        secure: true,
                        path: "/",
                        //debug: 3,
                    })}
                />
            )
        }
        if(this.state.logged) {
            return (
                <ScreenCapture 
                    socket={this.state.socket}
                    userID={this.state.userID}
                    peer={new Peer(uid(), {
                        host: REACT_HOST,
                        port: Number(REACT_PORT),
                        secure: true,
                        path:"/",
                        //debug: 3
                    })}
                />
            )
        }
        return (
            <div>
                <h1>Start Server</h1>
                <form onSubmit={this.startConnection}>
                    <div id="label-ip"><label htmlFor="get-ip">Connect to server</label></div>
                    <div id="ip-address"><input type="ip" name="get-ip" ref={this.ipRef}/></div>
                    <button type="submit">Server</button>
                </form>
                <h1>Join Room</h1>
                <form onSubmit={this.getScreen}>
                    <div id="label"><label htmlFor="get-host">Get Host</label></div>
                    <div id="host"><input type="text" name="get-host" ref={this.getHost}/></div>
                    <button type="submit">Get screen</button>
                    <button type="button" onClick={this.shareYourScreen}>Share your screen</button>
                </form>
            </div>
        )
    }
}
