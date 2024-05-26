
import React, { useState, useEffect } from 'react';
import './buttons.css'

// AudioGenerationModule component
const AudioGenerationModule = ({ detectedObjects }) => {
  const [storedObjects, setStoredObjects] = useState([]);
  const [generateAudio, setGenerateAudio] = useState(false);

  // Function to store detected objects
  const storeDetectedObjects = () => {
    setStoredObjects([...storedObjects, ...detectedObjects]);
  };

  // Function to generate audio for stored objects with a delay
  const generateAudioForStoredObjects = () => {
    let delay = 0; // Initial delay
    storedObjects.forEach(object => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(object);
        speechSynthesis.speak(utterance);
      }, delay);
      delay += 1000; //
    });
  };

  useEffect(() => {
    // Generate audio whenever new detected objects are received and generateAudio is true
    if (generateAudio && storedObjects.length > 0) {
      generateAudioForStoredObjects();
    }
  }, [generateAudio, storedObjects]);

  return (
    <div>
      <button className='btns' onClick={storeDetectedObjects}>Store Detected Objects</button>
      <button className='btns' onClick={() => setGenerateAudio(!generateAudio)}>
        {generateAudio ? 'Stop Audio' : 'Start Audio'}
      </button>
    </div>
  );
};

export default AudioGenerationModule;



