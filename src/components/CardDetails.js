// src/components/CardDetails.js
import React, { useRef, useEffect } from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  const modalRef = useRef(null);
  const card3DRef = useRef(null);

  useEffect(() => {
    const currentModalRef = modalRef.current; // Capture the current ref value
    const currentCard3DRef = card3DRef.current; // Capture the current ref value

    const handleMouseMove = (event) => {
      if (currentModalRef && currentCard3DRef) {
        const modal = currentModalRef.getBoundingClientRect();
        const centerX = modal.left + modal.width / 2;
        const centerY = modal.top + modal.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        const rotateYAmount = (mouseX / (modal.width / 2)) * 15;
        const rotateXAmount = (mouseY / (modal.height / 2)) * -10;

        currentCard3DRef.style.transform = `rotateY(${rotateYAmount}deg) rotateX(${rotateXAmount}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (currentCard3DRef) {
        currentCard3DRef.style.transform = 'rotateY(0deg) rotateX(0deg)'; // Reset rotation
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