import React, { Component, Fragment } from 'react';
import ScreenCapture from '../Screen/ScreenCapture';
import WatchScreen from '../Screen/WatchScreen';
import "../../styles/_ScreenHomepage.scss"


import Peer from "peerjs";
import ShortUniqueId from "short-unique-id";
interface Props {
    login?: any;
}
const REACT_HOST = String(process.env.REACT_APP_HOST);
const REACT_PORT = Number(process.env.REACT_APP_PORT);

const uid = new ShortUniqueId({length: 4})

interface State {
    logged: boolean;
    userID: string;
    getScreenId: string;
    socket: any;
    p_port: any;
    host: any;
    serverConnected: boolean;
    showShareScreenInput: boolean;
    showGetScreenInput: boolean;
    connectionEstablished: boolean;
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
            serverConnected: false,
            showGetScreenInput: false,
            showShareScreenInput: false,
            connectionEstablished: false,
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
        this.startConnection = this.startConnection.bind(this);
        this.showShareSreenInput = this.showShareSreenInput.bind(this);
        this.showGetSreenInput = this.showGetSreenInput.bind(this);
    }

    showShareSreenInput() {
        this.setState({
            showShareScreenInput: true,
        })
    }

    showGetSreenInput() {
        this.setState({
            showGetScreenInput: true,
        })
    }

    startConnection(e) {
        e.preventDefault();
        const url = this.ipRef.current!.value
        const socket = new WebSocket(url);
        socket.onopen = () => {
            socket.send("Hi from the client")
        }
        socket.onmessage = (data) => {
            console.log(data)
            this.setState({
                connectionEstablished: true,
            })
        }

        this.setState({
            socket: socket,
            host: REACT_HOST,
            p_port: REACT_PORT,
            serverConnected: true,
        })

        console.log(socket);
    }

    getScreen(e) {
        e.preventDefault();
        const HOST =this.getHost.current!.value;
        console.log("GET SCREEN", HOST)
        this.setState({
            getScreenId: HOST,
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
        if(this.state.showShareScreenInput) {
            return (
                <Fragment>
                    <h2>Connect to your local server</h2>
                    <form onSubmit={this.startConnection}>
                        <div id="ip-address"><input type="ip" name="get-ip" ref={this.ipRef} placeholder="Server url"/></div>
                        <div id="server-buttons-container">
                            <button type="submit">Server</button>
                            <button type="button" onClick={this.shareYourScreen} disabled={!this.state.serverConnected}>Share your screen</button>
                        </div>
                    </form>
                    {
                        this.state.connectionEstablished ?
                        <div>
                            <p>Successfully connected to the server!</p>
                        </div>
                        : null
                    }
                </Fragment>
            )
        }
        if(this.state.showGetScreenInput) {
            return (
                <Fragment>
                    <h2>Join session</h2>
                    <form onSubmit={this.getScreen}>
                        <div id="host"><input type="text" name="get-host" ref={this.getHost} placeholder="Insert session id"/></div>
                        <button type="submit">Get screen</button>
                    </form>
                </Fragment>
            )
        }
        return (
            <Fragment>         
                <div id="main-logo-container"><img src="https://i.ibb.co/34Ffnx7/ORCHEstra-2.png" alt="orchestra-logo" /></div>
                <div id="main-buttons-container">
                    <div id="share-container" className="choice"><button onClick={this.showShareSreenInput}>Share your screen</button></div>
                    <div id="watch-container" className="choice"><button onClick={this.showGetSreenInput}>Watch Screen</button></div>
                </div>
            </Fragment>
        )
    }
}
