import { useState, useEffect, useRef } from 'react';
import './Slideshow.css';

import examplePhoto from '../assets/images/slideshow1.png';
import examplePhoto2 from '../assets/images/booster-art-4-large-up.jpg';
import examplePhoto3 from '../assets/images/backgroundPhotoPokemon.png';
import examplePhoto4 from '../assets/images/cynthia_chomp.jpg';
import frontalPhoto from '../assets/images/scarlet_logo.png';
import frontalPhoto2 from '../assets/images/sun_logo.png';
import frontalPhoto3 from '../assets/images/pokemon_logo.png';
import frontalPhoto4 from '../assets/images/PokemonGay.webp';

const slides = [
  {
    image: examplePhoto,
    title: "Welcome to Pokemon Card Collection",
    description: "Build your dream collection today",
    logo: frontalPhoto3  // Pokemon main logo
  },
  {
    image: examplePhoto2,
    title: "Open Booster Packs",
    description: "Discover rare and powerful cards",
    logo: frontalPhoto  // Scarlet logo
  },
  {
    image: examplePhoto3,
    title: "Manage Your Collection",
    description: "Track your cards and their value",
    logo: frontalPhoto2  // Sun logo
  },
  {
    image: examplePhoto4,
    title: "Trade and Share",
    description: "Connect with other collectors",
    logo: frontalPhoto4  // Pokemon go logo
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
    }, 10000);
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
      <div className="slideshow-container" id ="slideshow">
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
              <img 
                src={slide.logo} 
                alt="Pokemon Logo" 
                className="frontal-photo"
              />
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
        <button className="slideshow-btn prev" onClick={goToPrev}>&#11164;</button>
        <button className="slideshow-btn next" onClick={goToNext}>&#11166;</button>
      </div>
    </>
  );
}

export default Slideshow;