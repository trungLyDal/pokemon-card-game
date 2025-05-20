// src/components/Layout.js
import React, { useState } from 'react';
import './Layout.css';
import AppLogo from '../assets/images/Pokémon_TCG_logo.png'; // Adjust the path as necessary

function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu when a link is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  return (
    <div className="main-app-layout-container" id = "slideshow">
      <header className="main-app-layout-header">
        <div className="main-app-layout-header-content">
          <img src={AppLogo} alt="Booster Pack Simulator Logo" className="main-app-layout-logo" onClick={handleLinkClick} />
          <div className="main-app-layout-header-spacer" />
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

      {isMenuOpen && (
        <div className="main-app-layout-menu-overlay" onClick={toggleMenu}></div>
      )}

      <main className="main-app-layout-main">{children}</main>

      {/* Footer with integrated Contact Us information */}
      <footer className="main-app-layout-footer" id="footer">
        <div className="main-app-layout-footer-contact-info">
          <h3>Contact Us</h3>
          <p>
            <strong>Email:</strong> <a href="mailto:giatrung59@gmail.com">giatrung59@gmail.com</a>
          </p>
          <p>
            Halifax, Nova Scotia, Canada
          </p>
        </div>
        <p className="main-app-layout-copyright">
          &copy; {new Date().getFullYear()} Pokemon Booster Card Simulator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Layout;