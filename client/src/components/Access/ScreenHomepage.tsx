import React, { Component} from 'react';
import ScreenCapture from '../Screen/ScreenCapture';
import WatchScreen from '../Screen/WatchScreen';

interface Props {
    login?: any;
}

interface State {
    logged: Boolean;
    userID: string;
    getScreenId: string;
}
export default class ScreenHomepage extends Component<Props, State> {
    private inputRef: React.RefObject<HTMLInputElement>;
    constructor(props?) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            logged: false,
            getScreenId: '',
            userID: "",
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
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
                />
            )
        }
        if(this.state.logged) {
            return (
                <ScreenCapture 
                    userID={this.state.userID}
                />
            )
        }
        return (
            <div>
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
