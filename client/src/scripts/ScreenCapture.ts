/**
 * Start the screen recording
 * @param {any} options
 * @returns {MediaStream}
 */
export const startScreenRecording = async (options: any) => {
    try {
        return navigator.mediaDevices.getDisplayMedia(options);
    }
    catch (err) {
        console.log("Error", err);
        return;
    }
}
/**
 * Stops the media screen sharing
 * Removes all the tracks
 * @param {HTMLVideoElement} videoRef
 */
export const stopScreenRecording = async (videoRef: HTMLVideoElement |null) => {
    try {
        let tracks = (videoRef!.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
    }
    catch (err) {
        console.log("Error", err);
        return;
    }
    videoRef!.srcObject = null;
}