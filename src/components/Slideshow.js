import { useState, useEffect } from 'react';
import './Slideshow.css';

import examplePhoto from '../assets/images/slideshow1.png';
import examplePhoto2 from '../assets/images/booster-art-4-large-up.jpg';
import examplePhoto3 from '../assets/images/backgroundPhotoPokemon.png';
import examplePhoto4 from '../assets/images/cynthia_chomp.jpg';

const images = [
  examplePhoto,
  examplePhoto2,
  examplePhoto3,
  examplePhoto4,
];

function Slideshow() {
  const [current, setCurrent] = useState(0);

  // Auto-advance slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handlers for manual navigation
  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      <div className="slideshow-container">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`slideshow-image${current === idx ? ' active' : ''}`}
            style={{ zIndex: current === idx ? 2 : 1 }}
          />
        ))}
        <button className="slideshow-btn prev" onClick={goToPrev} aria-label="Previous Slide">&#8592;</button>
        <button className="slideshow-btn next" onClick={goToNext} aria-label="Next Slide">&#8594;</button>
      </div>
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '1px solid #ccc' }} />
    </>
  );
}

export default Slideshow;