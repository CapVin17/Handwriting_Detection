"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import CameraBox from "../components/CameraBox";
import Instructions from "../components/Instructions";
import { useRouter } from "next/navigation";
import VideoRecorder from "../components/VideoRecorder";

const First = () => {
  const router = useRouter();

  const [screenWidth, setScreenWidth] = useState(0); // Set initial value to 0
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    speaker: false,
    screenShare: false,
    audioCheck: false,
  });

  const [startClicked, setStartClicked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [, setPermissionAttempts] = useState(0);

  useEffect(() => {
    // Ensure code runs only in the browser
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth); // Set screen width once the component is mounted

      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const resetPermissions = () => {
    setPermissions({
      camera: false,
      microphone: false,
      speaker: false,
      screenShare: false,
      audioCheck: false,
    });
  };

  const handleStartClick = async () => {
    // Reset previous attempts if any
    resetPermissions();
    setStartClicked(true);
    setPermissionAttempts((prev) => prev + 1);

    try {
      // Camera and Microphone Permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setPermissions((prev) => ({
        ...prev,
        camera: true,
        microphone: true,
      }));
      mediaStream.getTracks().forEach((track) => track.stop());

      // Speaker
      setTimeout(() => {
        setPermissions((prev) => ({
          ...prev,
          speaker: true,
        }));
      }, 500);

      // Screen Share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setPermissions((prev) => ({
          ...prev,
          screenShare: true,
        }));
        screenStream.getTracks().forEach((track) => track.stop());
      } catch (screenErr) {
        console.error("Screen share permission failed:", screenErr);
      }

      // Audio
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(audioStream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 512;
      microphone.connect(analyser);

      const detectAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0);

        if (volume > 1000) {
          setPermissions((prev) => ({
            ...prev,
            audioCheck: true,
          }));
          audioStream.getTracks().forEach((track) => track.stop());
        } else {
          setTimeout(detectAudio, 200);
        }
      };

      detectAudio();
    } catch (err) {
      console.error("Permission error:", err);
      resetPermissions();
    }
  };

  const handleStartInterview = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    router.push("/interview");
  };

  const allPermissionsGranted =
    permissions.camera &&
    permissions.microphone &&
    permissions.speaker &&
    permissions.screenShare &&
    permissions.audioCheck;

  const buttonLabel = allPermissionsGranted
    ? "Start Interview"
    : startClicked
    ? "Checking Permissions..."
    : "Start Now";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Trainee Interview</title>
      </Head>
      <Navbar />

      {screenWidth < 1528 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <p className="text-lg font-bold">
            Please go to fullscreen mode to start the test.
          </p>
        </div>
      ) : (
        <main className="p-6 flex justify-center items-center">
          <div className="container mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-grow bg-gray-800 rounded-lg flex justify-center items-center aspect-square">
              {/* Camera Box */}
              {allPermissionsGranted && !isRecording ? (
                <VideoRecorder
                  onTestCompleted={() => console.log("Test Completed!")}
                  setIsRecording={setIsRecording}
                  isRecording={isRecording}
                />
              ) : (
                <CameraBox />
              )}
            </div>

            {/* Instructions */}
            <div className="flex-grow md:w-1/2 bg-gray-800 rounded-lg p-6 flex flex-col justify-between">
              <Instructions
                startClicked={startClicked}
                permissions={permissions}
              />
              <div className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={handleStartClick}
                  disabled={startClicked && !allPermissionsGranted}
                  className={`${
                    startClicked && !allPermissionsGranted
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white font-bold py-2 px-6 rounded-md w-full`}
                >
                  {buttonLabel}
                </button>

                {allPermissionsGranted && (
                  <button
                    onClick={handleStartInterview}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md w-full"
                  >
                    Start Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default First;
