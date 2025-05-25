import { useState, useEffect } from 'react';
import './PackOpening.css';
import LoadingSpinner from './LoadingSpinner';
import boosterPackImage from '../assets/images/boosterPackScarletandViolet.webp';
import PackToggle from "./PackToggle";
import skipIcon from '../assets/images/skip-track.png';

const PackOpening = ({ addToCollection, addManyToCollection, collection }) => {
  const [openedCards, setOpenedCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packClicked, setPackClicked] = useState(false);
  const [revealedCardIndex, setRevealedCardIndex] = useState(-1);
  const [packZoomed, setPackZoomed] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTearing, setIsTearing] = useState(false);
  const [packHalves, setPackHalves] = useState(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [totalPackValue, setTotalPackValue] = useState(0);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [cardToRemove, setCardToRemove] = useState(null);
  const [error, setError] = useState(null);
  const [packsToOpen, setPacksToOpen] = useState(1);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // Fetch all cards from backend
  useEffect(() => {
fetch(`${API_BASE_URL}/api/cards?page=1&limit=10000`)
  .then(res => res.json())
  .then(data => {
    console.log("✅ Successfully fetched cards:", data);
    setCardData(data.cards);
    setIsLoadingCards(false);
  })
  .catch((err) => {
    console.error("❌ Failed to fetch cards from server:", err);
    setError('Failed to fetch cards from server.');
    setIsLoadingCards(false);
  });
  }, [API_BASE_URL]);

  // Initial loading spinner
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total pack value
  useEffect(() => {
    if (openedCards.length > 0) {
      const total = openedCards.reduce((sum, card) => (
        sum + (card?.cardmarket?.prices?.averageSellPrice || 0)
      ), 0);
      setTotalPackValue(total.toFixed(2));
    } else {
      setTotalPackValue(0);
    }
  }, [openedCards]);

  const handleCardMouseEnter = (index) => setHoveredCardIndex(index);
  const handleCardMouseLeave = () => setHoveredCardIndex(null);

  // Draw a random card from the loaded cardData
  const fetchRandomCard = () => {
    if (cardData && cardData.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardData.length);
      return cardData[randomIndex];
    }
    return null;
  };

  // Skip all animations in modal
  const handleSkipAll = () => {
    setRevealedCardIndex(openedCards.length - 1);
    setTimeout(() => setIsModalOpen(false), 100);
  };

  // Open a pack and draw cards
  const openPack = async () => {
    if (openedCards.length > 0 && !isModalOpen) {
      setError("You must add the current cards to your collection before opening another pack!");
      return;
    }

    setIsOpening(true);
    setShowLoadingScreen(true);
    setOpenedCards([]);
    setError(null);

    const drawnCardIds = new Set();
    const newOpenedCards = [];
    const numberOfPacks = packsToOpen;
    const numberOfCardsInPack = 5;

    for (let i = 0; i < numberOfPacks * numberOfCardsInPack; i++) {
      let randomCard = fetchRandomCard();
      if (randomCard) {
        // Ensure no duplicates in this pack
        while (drawnCardIds.has(randomCard.id)) {
          randomCard = fetchRandomCard();
          if (!randomCard) break;
        }
        if (randomCard) {
          drawnCardIds.add(randomCard.id);
          newOpenedCards.push(randomCard);
        } else {
          setIsOpening(false);
          setShowLoadingScreen(false);
          return;
        }
      } else {
        setIsOpening(false);
        setShowLoadingScreen(false);
        return;
      }
    }

    setTimeout(() => {
      setOpenedCards(newOpenedCards);
      setIsOpening(false);
      setShowLoadingScreen(false);
      setIsModalOpen(true);
      setRevealedCardIndex(0);
    }, 1000);
  };

  // Handle clicking the booster pack
  const handlePackClick = () => {
    if (isLoadingCards || cardData.length === 0) {
      setError("Cards are still loading. Please wait...");
      return;
    }
    if (openedCards.length > 0 && !isModalOpen) {
      setError("You must add the current cards to your collection before opening another pack!");
      return;
    }
    if (!isOpening && !packClicked && !isSplitting) {
      setPackClicked(true);
      setIsTearing(true);
      setPackZoomed(true);
      const packImageElement = document.querySelector('.booster-pack-container img');
      if (packImageElement) {
        const { offsetWidth, offsetHeight } = packImageElement;
        setPackHalves({
          top: {
            backgroundImage: `url(${boosterPackImage})`,
            backgroundPosition: 'top center',
            width: offsetWidth,
            height: offsetHeight * 0.2,
            top: 0,
            left: 0,
          },
          bottom: {
            backgroundImage: `url(${boosterPackImage})`,
            backgroundPosition: 'bottom center',
            width: offsetWidth,
            height: offsetHeight * 0.8,
            top: offsetHeight * 0.2,
            left: 0,
          },
        });
        setTimeout(() => {
          setIsTearing(false);
          setIsSplitting(true);
          document.querySelector('.booster-pack-container').classList.add('splitting');
          setTimeout(() => {
            setPackZoomed(false);
            openPack();
            document.querySelector('.booster-pack-container').classList.remove('splitting');
            setPackHalves(null);
          }, 800);
        }, 300);
      }
    }
  };

  // Modal click to reveal next card or close
  const handleModalClick = () => {
    if (isModalOpen && revealedCardIndex < openedCards.length - 1) {
      setRevealedCardIndex(prevIndex => prevIndex + 1);
    } else if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  // Add all opened cards to collection
  const handleAddAllToCollection = () => {
    const container = document.querySelector('.opened-cards');
    if (packsToOpen === 1) {
      const cards = document.querySelectorAll('.opened-card, .modal-card');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('collecting');
        }, idx * 80);
      });
      const button = document.querySelector('.add-all-button');
      if (button) button.classList.add('collecting');
      setTimeout(() => {
addManyToCollection(openedCards);        
setOpenedCards([]);
        setIsModalOpen(false);
        setPackClicked(false);
        setIsSplitting(false);
        if (container) {
          container.style.height = '0';
          container.style.padding = '0';
          container.style.margin = '0';
        }
      }, (cards.length * 80) + 700);
    } else {
addManyToCollection(openedCards);      
setOpenedCards([]);
      setIsModalOpen(false);
      setPackClicked(false);
      setIsSplitting(false);
      if (container) {
        container.style.height = '0';
        container.style.padding = '0';
        container.style.margin = '0';
      }
    }
  };

  // Scroll back to top after adding to collection
  const handleBacktoOpening = () => {
    document.getElementById('pack-opening-container-header').scrollIntoView({ behavior: 'smooth' });
  };

  // Reset UI state when modal closes
  useEffect(() => {
    if (!isModalOpen && packClicked) {
      setPackClicked(false);
      setPackZoomed(false);
      setIsSplitting(false);
    }
  }, [isModalOpen, packClicked]);

  // Remove card modal logic
  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setCardToRemove(null);
  };

  const confirmRemoveCard = () => {
    if (cardToRemove) {
      setOpenedCards(prevCards => prevCards.filter(c => c.id !== cardToRemove.id));
    }
    setIsRemoveModalOpen(false);
    setCardToRemove(null);
  };

  return (
    <div className="pack-opening-container" id="pack-opening-container-header">
      <h2>Open a Booster Pack</h2>
      {error && (
        <div className="error-message">{error}</div>
      )}
      {(isInitialLoading || showLoadingScreen || isLoadingCards) ? (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : !packClicked ? (
        <div
          className="booster-pack-container"
          onClick={handlePackClick}
          style={{ pointerEvents: isLoadingCards ? 'none' : 'auto', opacity: isLoadingCards ? 0.5 : 1 }}
        >
          <img
            src={boosterPackImage}
            alt="Booster Pack"
            className={`booster-pack-img${isTearing ? ' tearing' : ''}${packZoomed ? ' zoomed' : ''}${packClicked ? ' clicked' : ''}`}
          />
          {packClicked && packHalves && (
            <div className="booster-pack-split-container">
              <div className="pack-half top" style={packHalves.top}></div>
              <div className="pack-half bottom" style={packHalves.bottom}></div>
            </div>
          )}
        </div>
      ) : (
        <div className="booster-pack-loading">
          {isOpening ? <LoadingSpinner /> : <div className="booster-pack-loading-text">Opening Pack...</div>}
        </div>
      )}
      <div className="pack-toggle-group">
        <PackToggle
          packsToOpen={packsToOpen}
          setPacksToOpen={setPacksToOpen}
          disabled={isOpening || isInitialLoading}
        />
      </div>
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '3px solid #ccc' }} />

      {isModalOpen ? (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            {/* Skip All Button for 50 cards */}
            {openedCards.length >= 50 && revealedCardIndex < openedCards.length - 1 && (
              <button
                className="skip-all-btn"
                onClick={e => {
                  e.stopPropagation();
                  handleSkipAll();
                }}
                aria-label="Skip All Animations"
              >
                <img src={skipIcon} alt="Skip All Animations" style={{ width: 32, height: 32 }} />
              </button>
            )}
            {openedCards.map((card, index) => {
              let cardClass = 'modal-card';
              if (index < revealedCardIndex) {
                cardClass += ' hidden';
              } else if (index === revealedCardIndex) {
                cardClass += ' revealed';
              }
              return (
                <div key={card.id} className={cardClass}>
                  <img src={card.image} alt={card.name} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        openedCards.length > 0 && (
          <>
            <div className="opened-cards">
              {openedCards.map((card, index) => (
                <div key={card.id} className={`opened-card card-${index}`}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <img src={card.image} alt={card.name} />
                  {hoveredCardIndex === index && card?.cardmarket?.prices && (
                    <div className="card-info">
                      <p><strong>Avg Price:</strong> ${card.cardmarket.prices.averageSellPrice}</p>
                      <p><strong>Low Price:</strong> ${card.cardmarket.prices.lowPrice}</p>
                      <p><strong>Trend Price:</strong> ${card.cardmarket.prices.trendPrice}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pokemon-type-box">
              Estimated Pack Value: ${totalPackValue}
            </div>
            <button
              className="add-all-button"
              onClick={() => {
                handleAddAllToCollection();
                handleBacktoOpening();
              }}
            >
              Register to Pokedex
            </button>
          </>
        )
      )}
      {/* Remove Card Confirmation Modal */}
      {isRemoveModalOpen && (
        <div className="modal-overlay-confirmation">
          <div className="modal-content-confirmation">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this card from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveCard}>Yes, Remove</button>
              <button className="cancel-button" onClick={closeRemoveModal}>No, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackOpening;