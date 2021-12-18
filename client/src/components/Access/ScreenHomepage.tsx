import React, { Component} from 'react';
import ScreenCapture from '../Screen/ScreenCapture';
import WatchScreen from '../Screen/WatchScreen';
import {v4} from "uuid";

interface Props {
    login?: any;
}

interface State {
    logged: Boolean;
    userID: string;
    tokenId: string;
    getScreenId: string;
}
export default class ScreenHomepage extends Component<Props, State> {
    private inputRef: React.RefObject<HTMLInputElement>;
    constructor(props?) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            logged: false,
            tokenId: '',
            getScreenId: '',
            userID: "",
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
        this.inputRoomId = this.inputRoomId.bind(this);
    }

    inputRoomId(e) {
        this.setState({
            getScreenId: e.target.value,
        })
    }

    getScreen(e) {
        e.preventDefault();
        this.setState({
            logged: true,
        })
    }

    shareYourScreen(e) {
        e.preventDefault();
        let sessionId = v4();
        this.setState({
            logged: true,
            tokenId: sessionId,
        });
    }

    render() {
        if(this.state.getScreenId !== '' && this.state.logged) {
            return (
                <WatchScreen 
                    tokenId={this.state.getScreenId}
                />
            )
        }
        if(this.state.logged) {
            return (
                <ScreenCapture 
                    tokenId={this.state.tokenId}
                    userID={this.state.userID}
                />
            )
        }
        return (
            <div>
                <form onSubmit={this.getScreen}>
                    <div id="label"><label htmlFor="get-screen">Insert token</label></div>
                    <div id="token-id"><input type="text" name="get-screen" ref={this.inputRef} onChange={this.inputRoomId}/></div>
                    <button type="submit">Get screen</button>
                    <button type="button" onClick={this.shareYourScreen}>Share your screen</button>
                </form>
            </div>
        )
    }
}
