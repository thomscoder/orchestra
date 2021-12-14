import React, { Component} from 'react';
import ScreenCapture from '../Screen/ScreenCapture';

type Props = {
    login?: any
}
type State = {
    logged: Boolean;
    token: string;
}
export default class GetScreen extends Component<Props, State> {
    private inputRef: React.RefObject<HTMLInputElement>;
    constructor(props?) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            logged: false,
            token: "",
        }
        this.getScreen = this.getScreen.bind(this);
        this.shareYourScreen = this.shareYourScreen.bind(this);
    }

    getScreen(e) {
        e.preventDefault();
        this.setState({
            logged: this.inputRef.current!.value !== '' ? true : false,
            token: this.inputRef.current!.value,
        })
    }

    shareYourScreen(e) {
        e.preventDefault();
        this.setState({
            logged: true,
        })
    }

    render() {
        if(this.state.logged) {
            return (
                <ScreenCapture 
                    //@ts-ignore
                    tokenId={{token: this.state.token}} 
                />
            )
        }
        return (
            <div>
                <form onSubmit={this.getScreen}>
                    <div id="label"><label htmlFor="get-screen">Insert token</label></div>
                    <div id="token-id"><input type="text" name="get-screen" ref={this.inputRef} /></div>
                    <button type="submit">Get screen</button>
                    <button type="button" onClick={this.shareYourScreen}>Share your screen</button>
                </form>
            </div>
        )
    }
}
