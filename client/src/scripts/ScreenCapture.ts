export const startScreenRecording = async (videoRef: HTMLVideoElement |null, options: any) => {
    try {
        videoRef!.srcObject = await navigator.mediaDevices.getDisplayMedia(options);
        console.log(videoRef!.srcObject.getTracks())
        console.log(videoRef?.srcObject);
    }
    catch (err) {
        console.log("Error", err);
    }
}

export const stopScreenRecording = async (videoRef: HTMLVideoElement |null) => {
    try {
        let tracks = (<MediaStream>videoRef!.srcObject).getTracks();
        tracks.forEach(track => track.stop());
    }
    catch (err) {
        console.log("Error", err);
    }
}