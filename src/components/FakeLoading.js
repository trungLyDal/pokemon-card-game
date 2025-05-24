import React, { useState, useEffect } from 'react';

function FakeLoading({ onComplete, serverReady }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= 100) {
      onComplete();
      return;
    }

    let timeout;
    if (progress < 99) {
      // Slowly increase progress to 99%
      timeout = setTimeout(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 5, 99));
      }, 200);
    } else if (serverReady) {
      // Once server is ready, jump to 100%
      setProgress(100);
    }
    // else: stuck at 99% waiting for serverReady

    return () => clearTimeout(timeout);
  }, [progress, onComplete, serverReady]);

  return (
    <div className="loading-screen">
      <div className="progress-bar-container" style={{ width: '80%', background: '#eee', borderRadius: 8, margin: '0 auto' }}>
        <div
          className="progress-bar"
          style={{
            width: `${progress}%`,
            height: 20,
            backgroundColor: '#4caf50',
            borderRadius: 8,
            transition: 'width 0.2s ease',
          }}
        />
      </div>
      <h2>Loading server... {progress.toFixed(0)}%</h2>
      <p>Waking up the Render server. This may take a few seconds.</p>
    </div>
  );
}

export default FakeLoading;
