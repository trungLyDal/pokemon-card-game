// src/components/CardDetails.js
import React, { useRef, useEffect, useState } from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  const modalRef = useRef(null);
  const card3DRef = useRef(null);
  const [isTouchActive, setIsTouchActive] = useState(false);

  useEffect(() => {
    const currentModalRef = modalRef.current;
    const currentCard3DRef = card3DRef.current;

    const handleTouchStart = () => {
      setIsTouchActive(true);
      if (currentCard3DRef) {
        currentCard3DRef.style.transition = 'none'; // Remove transition during interaction
      }
    };

    const handleTouchMove = (event) => {
      if (currentModalRef && currentCard3DRef && isTouchActive) {
        const touch = event.touches[0];
        const modal = currentModalRef.getBoundingClientRect();
        const centerX = modal.left + modal.width / 2;
        const centerY = modal.top + modal.height / 2;
        const touchX = touch.clientX - centerX;
        const touchY = touch.clientY - centerY;

        // Adjust these multipliers to control the sensitivity of the tilt
        const rotateYAmount = (touchX / (modal.width / 2)) * 15;
        const rotateXAmount = (touchY / (modal.height / 2)) * -10;

        currentCard3DRef.style.transform = `rotateY(${rotateYAmount}deg) rotateX(${rotateXAmount}deg) perspective(800px)`;
      }
    };

    const handleTouchEnd = () => {
      setIsTouchActive(false);
      if (currentCard3DRef) {
        currentCard3DRef.style.transition = 'transform 0.3s ease-out'; // Restore transition
        currentCard3DRef.style.transform = 'rotateY(0deg) rotateX(0deg) perspective(800px)'; // Reset rotation
      }
    };

    if (currentModalRef) {
      currentModalRef.addEventListener('touchstart', handleTouchStart, { passive: true });
      currentModalRef.addEventListener('touchmove', handleTouchMove, { passive: true });
      currentModalRef.addEventListener('touchend', handleTouchEnd, { passive: true });
      currentModalRef.addEventListener('touchcancel', handleTouchEnd, { passive: true }); // Handle interruptions
    }

    return () => {
      if (currentModalRef) {
        currentModalRef.removeEventListener('touchstart', handleTouchStart);
        currentModalRef.removeEventListener('touchmove', handleTouchMove);
        currentModalRef.removeEventListener('touchend', handleTouchEnd);
        currentModalRef.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, [isTouchActive]);

  // Keep the desktop mouse interaction logic
  useEffect(() => {
    const currentModalRef = modalRef.current;
    const currentCard3DRef = card3DRef.current;

    const handleMouseMove = (event) => {
      if (currentModalRef && currentCard3DRef && !isTouchActive) {
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
      if (currentCard3DRef && !isTouchActive) {
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
  }, [isTouchActive]);

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