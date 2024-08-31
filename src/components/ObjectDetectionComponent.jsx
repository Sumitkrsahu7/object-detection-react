import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './ObjectDetection.css';
import AudioGenerationModule from './AudioGenerationModule';
import { useNavigate } from 'react-router-dom'; 

const ObjectDetectionComponent = () => {
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false); // Set camera initially off

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const startVideoStream = async () => {
      try {
        if (isCameraOn) {
          const constraints = { video: true };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setVideoStream(stream);
          videoRef.current.srcObject = stream;
        } else {
          if (videoStream && typeof videoStream.getTracks === 'function') {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
          }
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startVideoStream();

    return () => {
      if (videoStream && typeof videoStream.getTracks === 'function') {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]); // Add isCameraOn as a dependency

  useEffect(() => {
    const initializeModel = async () => {
      try {
        await tf.setBackend('webgl'); // Use WebGL backend for GPU acceleration
        const model = await cocoSsd.load();
        modelRef.current = model;
      } catch (error) {
        console.error('Error initializing model:', error);
      }
    };

    initializeModel();

    return () => {
      // Clean up model resources
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const model = modelRef.current;
        const predictions = await model.detect(videoRef.current);
        setDetectedObjects(predictions.map(prediction => prediction.class));
        drawBoundingBoxes(predictions);
        speakDetectedObjects(predictions);
      }
    }, 1000); // Adjust the detection interval as needed

    return () => clearInterval(interval);
  }, []);

  const handleFrameCapture = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleToggleCamera = () => {
    setIsCameraOn(prevState => !prevState); // Toggle camera status
  };

  const drawBoundingBoxes = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get video dimensions
    const video = videoRef.current;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;

      // Adjust bounding box coordinates based on video aspect ratio
      const adjustedX = x * canvas.width / videoWidth;
      const adjustedY = y * canvas.height / videoHeight;
      const adjustedWidth = width * canvas.width / videoWidth;
      const adjustedHeight = height * canvas.height / videoHeight;

      const textWidth = ctx.measureText(prediction.class).width;
      ctx.strokeStyle = '#00ff00'; // Green color for the border
      ctx.lineWidth = 2;
      ctx.strokeRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px Arial';
      ctx.fillText(prediction.class, adjustedX + (adjustedWidth - textWidth) / 2, adjustedY - 5); // Adjust text position based on text width
    });
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  const speakDetectedObjects = (predictions) => {
    setTimeout(() => {
      const detectedObjects = predictions.map(prediction => prediction.class);
      setDetectedObjects(detectedObjects);
    }, 1000); // Speak detected objects after 1 second delay
  };

  return (
    <div className="object-detection-container">
      <video ref={videoRef} autoPlay playsInline onLoadedData={handleFrameCapture} className="video-stream" />
      <canvas ref={canvasRef} className="detection-canvas"></canvas>
      <div className="detected-objects-container">
        <h2>Detected Objects:</h2>
        <ul>
          {detectedObjects.map((object, index) => (
            <li key={index}>- {object}</li>
          ))}
        </ul>
      </div>
      <button className="fullscreen-button button-name" onClick={handleToggleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</button>
      <button className="camera-toggle-button button-name" onClick={handleToggleCamera}>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
      {/* Integrate AudioGenerationModule */}
      <AudioGenerationModule detectedObjects={detectedObjects} />
      <div>
      <button onClick={handleGoBack} className="button">Go Back</button>
      </div>
    </div>
  );
};

export default ObjectDetectionComponent;
