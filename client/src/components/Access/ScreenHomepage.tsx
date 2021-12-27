import React, { Component} from 'react';
import ScreenCapture from '../Screen/ScreenCapture';
import WatchScreen from '../Screen/WatchScreen';

import io from "socket.io-client";
import Peer from "peerjs";

import { v4 }from "uuid";

interface Props {
    login?: any;
}

interface State {
    logged: Boolean;
    userID: string;
    getScreenId: string;
    socket: any;
    p_port: any;
    host: any;
    ipMod: any;
    uniqueIp: any;
}
export default class ScreenHomepage extends Component<Props, State> {
    private inputRef: React.RefObject<HTMLInputElement>;
    private ipRef: React.RefObject<HTMLInputElement>;
    private pPortRef: React.RefObject<HTMLInputElement>;
    private nPortRef: React.RefObject<HTMLInputElement>;
    constructor(props?) {
        super(props);
        this.inputRef = React.createRef();
        this.ipRef = React.createRef();
        this.pPortRef = React.createRef();
        this.nPortRef = React.createRef();
        this.state = {
            logged: false,
            getScreenId: '',
            userID: "",
            socket: undefined,
            host: undefined,
            p_port: undefined,
            ipMod: undefined,
            uniqueIp: undefined,
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
        this.startConnection = this.startConnection.bind(this);
    }

    startConnection(e) {
        e.preventDefault();
        const socket = io(`https://${this.ipRef.current!.value}:${this.nPortRef.current!.value}`);
        const HOST = String(this.ipRef.current!.value);
        //@ts-ignore
        const PORT = Number(this.pPortRef.current!.value);
        //@ts-ignore
        const host = String(this.ipRef.current!.value.split('.').join(''));
        const uIp = v4();

        this.setState({
            socket: socket,
            ipMod: host,
            uniqueIp: uIp,
            host: HOST,
            p_port: PORT,
        })

        console.log(socket);
    }

    getScreen(e) {
        e.preventDefault();
        this.setState({
            getScreenId: this.inputRef.current!.value,
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
                    peer ={new Peer(this.state.uniqueIp,{
                        host: this.state.host,
                        port: this.state.p_port,
                        secure: true,
                        path: "/"
                    })}
                />
            )
        }
        if(this.state.logged) {
            return (
                <ScreenCapture 
                    socket={this.state.socket}
                    userID={this.state.userID}
                    peer={new Peer(this.state.ipMod, {
                        host: this.state.host,
                        port: this.state.p_port,
                        secure: true,
                        path:"/"
                    })}
                />
            )
        }
        return (
            <div>
                <form onSubmit={this.startConnection}>
                    <div id="label-ip"><label htmlFor="get-ip">Insert ip</label></div>
                    <div id="ip-address"><input type="ip" name="get-ip" ref={this.ipRef}/></div>
                    <div id="label-p-port"><label htmlFor="get-p-port">Insert p-port</label></div>
                    <div id="p-ort"><input type="p-port" name="get-p-port" ref={this.pPortRef}/></div>
                    <div id="label-n-port"><label htmlFor="get-n-port">Insert n-port</label></div>
                    <div id="n-port"><input type="n-port" name="get-n-port" ref={this.nPortRef}/></div>
                    <button type="submit">Server</button>
                </form>
                <form onSubmit={this.getScreen}>
                    <div id="label"><label htmlFor="get-screen">Insert token</label></div>
                    <div id="token-id"><input type="text" name="get-screen" ref={this.inputRef}/></div>
                    <button type="submit">Get screen</button>
                    <button type="button" onClick={this.shareYourScreen}>Share your screen</button>
                </form>
            </div>
        )
    }
}
