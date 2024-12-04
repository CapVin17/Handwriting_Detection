"use client"

import { useEffect, useRef } from "react"

const CameraBox = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        if(videoElement)
        {
            navigator.mediaDevices.getUserMedia({video:true}).then((stream) => {
                videoElement.srcObject = stream;
                videoElement.play();
            })
            .catch((error) => {
                console.log("Error accessing the camera", error);
            })
        }
    },[]);
  return <div>
    <video ref={videoRef} autoPlay muted className="w-full h-full rounded-md" />
  </div>
};

export default CameraBox