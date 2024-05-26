import React, { useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useNavigate } from 'react-router-dom'; 
import './ObjectRecognition.css';
import AudioGenerationModule from './AudioGenerationModule';

function ObjectRecognition() {
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [detectionInProgress, setDetectionInProgress] = useState(false);
  const navigate = useNavigate();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const detectObjects = async () => {
    try {
      const model = await cocoSsd.load();
      const imageElement = document.createElement('img');
      imageElement.src = imageURL;
      imageElement.onload = async () => {
        setDetectionInProgress(true);
        const predictions = await model.detect(imageElement);
        setDetectedObjects(predictions.map(prediction => prediction.class));
        setDetectionInProgress(false);
      };
    } catch (error) {
      console.error('Error detecting objects:', error);
      setDetectionInProgress(false);
    }
  };

  const handleDetectButtonClick = () => {
    if (selectedFile && !detectionInProgress) {
      setDetectedObjects([]);
      detectObjects();
    } else {
      console.warn('No file selected or object detection already in progress');
    }
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="container">
      <h2>Object Recognition</h2>
      <div className="file-input-wrapper">
        <button className="file-input-button">Choose File</button>
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
      </div>
      {imageURL && <img src={imageURL} alt="Selected" className="image" />}
      <div className="button-container">
        <button onClick={handleDetectButtonClick} disabled={detectionInProgress} className="button">
          {detectionInProgress ? 'Detecting Objects...' : 'Detect Objects'}
        </button>
        <button onClick={handleGoBack} className="button">Go Back</button>
      </div>
      {detectedObjects.length > 0 && (
        <div className="detected-objects">
          <h3>Detected Objects:</h3>
          <ul>
            {detectedObjects.map((object, index) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        <AudioGenerationModule detectedObjects={detectedObjects} />
        </div>
      )}
    </div>
  );
}

export default ObjectRecognition;
