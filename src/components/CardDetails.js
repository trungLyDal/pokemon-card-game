import React, { useRef, useEffect, useState } from 'react';
import './CardDetails.css';

const CardDetails = ({ card, onClose }) => {
  const modalRef = useRef(null);
  const card3DRef = useRef(null);
  const ballCursorRef = useRef(null); // Ref for the ball cursor
  const glowRef = useRef(null); // Ref for the glow effect
  const [isTouchActive, setIsTouchActive] = useState(false);

  useEffect(() => {
    const currentModalRef = modalRef.current;
    const currentCard3DRef = card3DRef.current;
    const currentBallCursorRef = ballCursorRef.current;
    const currentGlowRef = glowRef.current;

    const handleTouchStart = () => {
      setIsTouchActive(true);
      if (currentCard3DRef) {
        currentCard3DRef.style.transition = 'none';
      }
      if (currentBallCursorRef) {
        currentBallCursorRef.style.opacity = '0';
      }
      if (currentGlowRef) {
        currentGlowRef.style.opacity = '0';
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

        const rotateYAmount = (touchX / (modal.width / 2)) * 15;
        const rotateXAmount = (touchY / (modal.height / 2)) * -10;

        currentCard3DRef.style.transform = `rotateY(${rotateYAmount}deg) rotateX(${rotateXAmount}deg) perspective(800px)`;
        if (currentBallCursorRef) {
          currentBallCursorRef.style.opacity = '0';
        }
        if (currentGlowRef) {
          currentGlowRef.style.opacity = '0';
        }
      }
    };

    const handleTouchEnd = () => {
      setIsTouchActive(false);
      if (currentCard3DRef) {
        currentCard3DRef.style.transition = 'transform 0.3s ease-out';
        currentCard3DRef.style.transform = 'rotateY(0deg) rotateX(0deg) perspective(800px)';
      }
      if (currentBallCursorRef) {
        currentBallCursorRef.style.opacity = '0';
      }
      if (currentGlowRef) {
        currentGlowRef.style.opacity = '0';
      }
    };

    if (currentModalRef) {
      currentModalRef.addEventListener('touchstart', handleTouchStart, { passive: true });
      currentModalRef.addEventListener('touchmove', handleTouchMove, { passive: true });
      currentModalRef.addEventListener('touchend', handleTouchEnd, { passive: true });
      currentModalRef.addEventListener('touchcancel', handleTouchEnd, { passive: true });
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

  useEffect(() => {
    const currentModalRef = modalRef.current;
    const currentCard3DRef = card3DRef.current;
    const currentBallCursorRef = ballCursorRef.current;
    const currentGlowRef = glowRef.current;

    const handleMouseMove = (event) => {
      if (currentModalRef && currentCard3DRef && currentBallCursorRef && currentGlowRef && !isTouchActive) {
        const modalRect = currentModalRef.getBoundingClientRect();
        const x = event.clientX - modalRect.left;
        const y = event.clientY - modalRect.top;

        // Position the ball cursor
        currentBallCursorRef.style.left = `${x}px`;
        currentBallCursorRef.style.top = `${y}px`;
        currentBallCursorRef.style.opacity = '1';

        // Position the glow effect
        currentGlowRef.style.left = `${x}px`;
        currentGlowRef.style.top = `${y}px`;
        currentGlowRef.style.opacity = '1';

        const centerX = modalRect.left + modalRect.width / 2;
        const centerY = modalRect.top + modalRect.height / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        currentCard3DRef.style.transform = `rotateY(${mouseX / (modalRect.width / 2) * 15}deg) rotateX(${mouseY / (modalRect.height / 2) * -10}deg) perspective(800px)`;
      }
    };

    const handleMouseLeave = () => {
      if (currentCard3DRef && !isTouchActive) {
        currentCard3DRef.style.transform = 'rotateY(0deg) rotateX(0deg) perspective(800px)';
      }
      if (currentBallCursorRef) {
        currentBallCursorRef.style.opacity = '0';
      }
      if (currentGlowRef) {
        currentGlowRef.style.opacity = '0';
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
        <div className="card-3d-container" ref={card3DRef} style={{ position: 'relative', overflow: 'hidden' }}>
          <img
  src={card.images?.large || card.images?.small || card.image}
  alt={card.name}
  className="card-3d-image"
  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', cursor: 'none' }}
/>
          <div
            ref={ballCursorRef}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              pointerEvents: 'none',
              opacity: '0',
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.1s ease-out, left 0.05s ease-out, top 0.05s ease-out',
              zIndex: 10, // Ensure it's on top of the image
            }}
          />
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              width: '60px', // Adjust glow size
              height: '60px', // Adjust glow size
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 20%, transparent 80%)', // Adjust glow color and spread
              pointerEvents: 'none',
              opacity: '0',
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.1s ease-out, left 0.05s ease-out, top 0.05s ease-out',
              zIndex: 5, // Keep it behind the ball cursor
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetails;