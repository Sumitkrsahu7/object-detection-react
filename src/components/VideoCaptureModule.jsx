import React, { useEffect, useRef } from 'react';

const VideoCaptureModule = ({ onFrameCapture }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        const constraints = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startVideoStream();

    return () => {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const handleFrameCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onFrameCapture(frame);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline onLoadedData={handleFrameCapture} />
      <button onClick={handleFrameCapture}>Capture Frame</button>
    </div>
  );
};

export default VideoCaptureModule;
