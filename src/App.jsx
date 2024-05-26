// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/HomePage';
import ObjectDetectionComponent from './components/ObjectDetectionComponent';
import ObjectRecognition from './components/ObjectRecognition';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/object-detection" element={<ObjectDetectionComponent />} />
        <Route path="/object-recognition" element={<ObjectRecognition />} />
      </Routes>
    </Router>
  );
};

export default App;
