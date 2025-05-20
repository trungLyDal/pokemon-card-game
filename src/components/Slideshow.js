import { useState, useEffect, useRef } from 'react';
import './Slideshow.css';

import examplePhoto from '../assets/images/slideshow1.png';
import examplePhoto2 from '../assets/images/booster-art-4-large-up.jpg';
import examplePhoto3 from '../assets/images/backgroundPhotoPokemon.png';
import examplePhoto4 from '../assets/images/cynthia_chomp.jpg';

const slides = [
  {
    image: examplePhoto,
    title: "Welcome to Pokemon Card Collection",
    description: "Build your dream collection today"
  },
  {
    image: examplePhoto2,
    title: "Open Booster Packs",
    description: "Discover rare and powerful cards"
  },
  {
    image: examplePhoto3,
    title: "Manage Your Collection",
    description: "Track your cards and their value"
  },
  {
    image: examplePhoto4,
    title: "Trade and Share",
    description: "Connect with other collectors"
  }
];

function Slideshow() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Function to start or restart the interval
  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, []);

  // Handlers for manual navigation
  const goToPrev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    startInterval(); // Reset timer
  };

  const goToNext = () => {
    setCurrent(prev => (prev + 1) % slides.length);
    startInterval(); // Reset timer
  };

  return (
    <>
      <div className="slideshow-container">
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`slide-content${current === idx ? ' active' : ''}`}
          >
            <img
              src={slide.image}
              alt={`Slide ${idx + 1}`}
              className={`slideshow-image${current === idx ? ' active' : ''}`}
              style={{ zIndex: 1 }}
            />
            <div 
              className={`slide-text${current === idx ? ' active' : ''}`} 
              style={{ zIndex: 3 }}
            >
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        <button className="slideshow-btn prev" onClick={goToPrev}>&#8592;</button>
        <button className="slideshow-btn next" onClick={goToNext}>&#8594;</button>
      </div>
    </>
  );
}

export default Slideshow;