import React, { Component, RefObject } from 'react';
import "../../styles/_ScreenCapture.scss";


interface Props {
    tokenId: string;
}

export default class WatchScreen extends Component<Props> {
    private getScreenRef: RefObject<HTMLVideoElement>
    constructor(props) {
        super(props);
        this.getScreenRef = React.createRef();
    }
    componentDidMount() {
        const payload = {
            room: this.props.tokenId,
        }
    }

    componentDidUpdate() {
        
    }

    render() {
        return (
            <div>
                <video id="share-video" ref={this.getScreenRef}></video>
            </div>
        )
    }
}
