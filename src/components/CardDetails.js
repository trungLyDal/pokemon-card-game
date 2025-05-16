// src/components/CardDetails.js
import React, { useRef, useEffect } from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  const modalRef = useRef(null);
  const card3DRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (modalRef.current && card3DRef.current) {
        const modal = modalRef.current.getBoundingClientRect();
        const centerX = modal.left + modal.width / 2;
        const centerY = modal.top + modal.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        // Normalize mouse coordinates to a range of -1 to 1
        const rotateYAmount = (mouseX / (modal.width / 2)) * 15; // Adjust multiplier for sensitivity
        const rotateXAmount = (mouseY / (modal.height / 2)) * -10; // Negative for intuitive vertical rotation

        card3DRef.current.style.transform = `rotateY(${rotateYAmount}deg) rotateX(${rotateXAmount}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (card3DRef.current) {
        card3DRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)'; // Reset rotation
      }
    };

    if (modalRef.current) {
      modalRef.current.addEventListener('mousemove', handleMouseMove);
      modalRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('mousemove', handleMouseMove);
        modalRef.current.removeEventListener('mouseleave', handleMouseLeave);
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