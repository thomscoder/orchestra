export const startScreenRecording = async (options: any) => {
    try {
        return navigator.mediaDevices.getDisplayMedia(options);
    }
    catch (err) {
        console.log("Error", err);
    }
}

export const stopScreenRecording = async (videoRef: HTMLVideoElement |null) => {
    try {
        let tracks = (videoRef!.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
    }
    catch (err) {
        console.log("Error", err);
    }
    videoRef!.srcObject = null;
}

export const shareScreenRecording = async (videoRef: HTMLVideoElement |null, oldVideoRef: HTMLVideoElement | null, options: any) => {
    try {
        videoRef!.srcObject = oldVideoRef!.srcObject;
        console.log(String(videoRef!.srcObject));
    }
    catch (err) {
        console.log("Error", err);
    }
}

export const stopScreenSharing = async (videoRef: HTMLVideoElement |null) => {
    
    videoRef!.srcObject = null;
}