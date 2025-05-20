import { useState, useEffect } from 'react';
import './Slideshow.css';

import examplePhoto from '../assets/images/slideshow1.png';
import examplePhoto2 from '../assets/images/booster-art-4-large-up.jpg';
import examplePhoto3 from '../assets/images/backgroundPhotoPokemon.png';

const images = [
  examplePhoto,
  examplePhoto2,
  examplePhoto3,
];

function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      </div>
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '1px solid #ccc' }} />
    </>
  );
}

export default Slideshow;