import React, { useState } from 'react';

const UserInterfaceModule = ({ videoStream, detectedObjects, audioResults, showControls }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div>
      <video src={videoStream} controls={showControls} />
      <div>Detected Objects: {detectedObjects.join(', ')}</div>
      <div>Audio Results: {audioResults}</div>
      <button onClick={handleToggleFullscreen}>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</button>
    </div>
  );
};

export default UserInterfaceModule;
