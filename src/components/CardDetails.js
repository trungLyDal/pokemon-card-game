// src/components/CardDetails.js
import React, { useRef, useEffect } from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  const modalRef = useRef(null);
  const card3DRef = useRef(null);

  useEffect(() => {
    const currentModalRef = modalRef.current;
    const currentCard3DRef = card3DRef.current;

    const handleMouseMove = (event) => {
      if (currentModalRef && currentCard3DRef) {
        const modal = currentModalRef.getBoundingClientRect();
        const centerX = modal.left + modal.width / 2;
        const centerY = modal.top + modal.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        const rotateYAmount = (mouseX / (modal.width / 2)) * 15;
        const rotateXAmount = (mouseY / (modal.height / 2)) * -10;

        currentCard3DRef.style.transform = `rotateY(${rotateYAmount}deg) rotateX(${rotateXAmount}deg) perspective(800px)`;
      }
    };

    const handleMouseLeave = () => {
      if (currentCard3DRef) {
        currentCard3DRef.style.transform = 'rotateY(0deg) rotateX(0deg) perspective(800px)'; // Reset with perspective
      }
    };

    if (currentModalRef) {
      currentModalRef.addEventListener('mousemove', handleMouseMove);
      currentModalRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentModalRef) {
        currentModalRef.removeEventListener('mousemove', handleMouseMove);
        currentModalRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const currentCard3DRef = card3DRef.current;

    const handleOrientation = (event) => {
      if (currentCard3DRef) {
        const beta = event.beta ? Math.round(event.beta) : 0;
        const gamma = event.gamma ? Math.round(event.gamma) : 0;

        const rotateXAmount = beta * 0.5;
        const rotateYAmount = gamma * 0.5;

        currentCard3DRef.style.transform = `rotateX(${rotateXAmount}deg) rotateY(${rotateYAmount}deg) perspective(800px)`;
      }
    };

    const requestOrientationPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permissionState = await DeviceOrientationEvent.requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            console.warn('Device orientation permission not granted.');
            // Optionally display a message to the user
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error);
        }
      } else {
        // Non-iOS browsers don't typically require permission
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    // Only request and listen for device orientation on mobile devices
    if (typeof window.DeviceOrientationEvent !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)) {
      requestOrientationPermission();
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }

    // For desktop, the mousemove effect is already handled in the first useEffect
    return () => {}; // Empty cleanup for desktop
  }, []);

  if (!card) {
    return null;
  }

  return (
    <div className="card-details-overlay" onClick={onClose}>
      <div className="card-details-modal only-image" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button onClick={onClose} className="close-button">
          X
        </button>
        <div className="card-3d-container" ref={card3DRef}>
          <img src={card.images.large} alt={card.name} className="card-3d-image" />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;