// src/components/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

// Accept an 'isFullScreen' prop
const LoadingSpinner = ({ isFullScreen = false }) => {
  // Apply a specific class to the wrapper based on the prop
  const wrapperClass = isFullScreen ? 'loader-overlay-fullscreen' : 'loader-overlay-inline';

  return (
    // This new div acts as the container for positioning your loader
    <div className={wrapperClass}>
      <div className="loader"></div> {/* Your existing loader div */}
    </div>
  );
};

export default LoadingSpinner;