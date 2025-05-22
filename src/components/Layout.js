// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import ScrollToTopButton from './ScrollToTopButton';
import './Layout.css';
import AppLogo from '../assets/images/Pokémon_TCG_logo.png'; 
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import PokeballImg from '../assets/images/9.png';


function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      const scrolled = window.scrollY;
      setShowScroll(scrolled > 100); // Lower threshold for better UX
    };

    window.addEventListener('scroll', checkScrollTop);
    checkScrollTop(); // Check initial position
    
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu when a link is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const handleLogoClick = () => {
    const slideshow = document.getElementById('slideshow');
    if (slideshow) {
      slideshow.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="main-app-layout-container" id="slideshow">
      <header className="main-app-layout-header">
        <div className="main-app-layout-header-content">
          <img 
            src={AppLogo} 
            alt="Booster Pack Simulator Logo" 
            className="main-app-layout-logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }} 
          />
          <button
            className={`main-app-layout-hamburger-menu ${
              isMenuOpen ? 'open' : ''
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="main-app-layout-hamburger-bar"></span>
            <span className="main-app-layout-hamburger-bar"></span>
            <span className="main-app-layout-hamburger-bar"></span>
          </button>

          <nav
            className={`main-app-layout-nav-links ${
              isMenuOpen ? 'open' : ''
            }`}
          >
            {/* Updated hrefs to match the section IDs */}
            <a href="#pack-opening-section" onClick={handleLinkClick}>
              PACK OPENING
            </a>
            <a href="#card-gallery-section" onClick={handleLinkClick}>
              GALLERY
            </a>
            <a href="#footer" onClick={handleLinkClick}>
              CONTACT
            </a>
          </nav>
        </div>
      </header>

      <main className="main-app-layout-main">
        {children}
      </main>

      {showScroll && <ScrollToTopButton />}

        <footer className="main-app-layout-footer" id="footer">
        <div className="footer">
          <div className="bubbles">
        {[...Array(48)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
          '--size': `${2 + Math.random() * 4}rem`,
          '--distance': `${6 + Math.random() * 4}rem`,
          '--position': `${-5 + Math.random() * 110}%`,
          '--time': `${2 + Math.random() * 2}s`,
          '--delay': `${-1 * (2 + Math.random() * 2)}s`
            }}
          />
        ))}
          </div>
          <div className="content">
        <div>
          <div>
            <b>Quick Links</b>
            <a href="https://pokemoncardprices.io/card-info"     target="_blank"
style={{ textDecoration: 'underline' }}
          >Cards Prices</a>
          </div>
          <div>
            <b>Contact Us</b>
            <a
          href="mailto:giatrung59@gmail.com"
          style={{ textDecoration: 'underline' }}
            >
          giatrung59@gmail.com
            </a>
          </div>
          <div>
  <b>Follow Us</b>
  <a
    href="https://github.com/trungLyDal"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}
  >
    <FaGithub />
  </a>
  <a
    href="https://www.linkedin.com/in/trung-ly-dal/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    style={{ fontSize: '1.5rem' }}
  >
    <FaLinkedin />
  </a>
  <a
    href="mailto:giatrung59@gmail.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    style={{ fontSize: '1.5rem' }}
  >
    <FaEnvelope />
  </a>
</div>
        </div>
        <div>
          <a
            className="image"
            href="https://pokemontcgcollection.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundImage: `url(${PokeballImg})`
            }}
            aria-label="Pokeball Home"
          >
            {/* Add visually hidden text for accessibility */}
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
              Pokeball Home
            </span>
          </a>
          <p>©2025 PBBS</p>
        </div>
          </div>
        </div>
        {/* SVG filter for bubbles */}
  <svg style={{ position: 'fixed', top: '100vh' }}>
    <defs>
      <filter id="blob">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
          result="blob"
        />
      </filter>
    </defs>
  </svg>
</footer>
    </div>
  );
}

export default Layout;