import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function Homepage() {
  return (
    <div className='container cnt'>
      <h1 className='title'>Welcome to Object Detection and Recognition App</h1>
      <h3>Please select your option👇</h3>
      <div className='cont-2'>
        <div className='btn'>
          <Link to="/object-detection" className='option'>Object Detection</Link>
        </div>
        <div className='btn'>
          <Link to="/object-recognition" className='option'>Object Recognition</Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
