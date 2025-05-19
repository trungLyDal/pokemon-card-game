import React, { useState, useEffect } from 'react';
import './PackOpening.css';
import LoadingSpinner from './LoadingSpinner';
import cardData from '../data/all_pokemon_cards.json';
import boosterPackImage from '../assets/images/boosterPackScarletandViolet.webp';

const PackOpening = ({ addToCollection }) => {
  const [openedCards, setOpenedCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState(null);
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
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // State for remove confirmation
  const [cardToRemove, setCardToRemove] = useState(null); // State to store the card to remove

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openedCards.length > 0) {
      const total = openedCards.reduce((sum, card) => {
        return sum + (card?.cardmarket?.prices?.averageSellPrice || 0);
      }, 0);
      setTotalPackValue(total.toFixed(2));
    } else {
      setTotalPackValue(0);
    }
  }, [openedCards]);

  const handleCardMouseEnter = (index) => {
    setHoveredCardIndex(index);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardIndex(null);
  };

  const fetchRandomCard = () => {
    if (cardData && cardData.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardData.length);
      return cardData[randomIndex];
    } else {
      console.warn('No card data found in local JSON file (all_pokemon_cards.json).');
      setError('Failed to fetch random cards (local data empty).');
      return null;
    }
  };

  const openPack = async () => {
    if (openedCards.length > 0 && !isModalOpen) {
      setError("You must add the current cards to your collection before opening another pack!");
      return;
    }

    setIsOpening(true);
    setOpenedCards([]);
    setError(null);
    const numberOfCardsInPack = 5;
    const drawnCardIds = new Set();
    const newOpenedCards = [];

    for (let i = 0; i < numberOfCardsInPack; i++) {
      let randomCard = fetchRandomCard();
      if (randomCard) {
        while (drawnCardIds.has(randomCard.id)) {
          randomCard = fetchRandomCard();
          if (!randomCard) break;
        }
        if (randomCard) {
          drawnCardIds.add(randomCard.id);
          newOpenedCards.push(randomCard);
        } else {
          setIsOpening(false);
          return;
        }
      } else {
        setIsOpening(false);
        return;
      }
    }
    setOpenedCards(newOpenedCards);
    setIsOpening(false);
    setIsModalOpen(true);
    setRevealedCardIndex(0);
  };

  const handlePackClick = () => {
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

  const handleModalClick = () => {
    if (isModalOpen && revealedCardIndex < openedCards.length - 1) {
      setRevealedCardIndex(prevIndex => prevIndex + 1);
    } else if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleAddAllToCollection = () => {
    openedCards.forEach(card => {
      addToCollection(card);
    });
    setOpenedCards([]);
    setIsModalOpen(false);
    setPackClicked(false);
    setIsSplitting(false);
  };

  useEffect(() => {
    if (!isModalOpen && packClicked) {
      setPackClicked(false);
      setPackZoomed(false);
      setIsSplitting(false);
    }
  }, [isModalOpen, packClicked]);


  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setCardToRemove(null);
  };

  const confirmRemoveCard = () => {
    if (cardToRemove) {
      // Remove the card from the openedCards array
      setOpenedCards(prevCards => prevCards.filter(c => c.id !== cardToRemove.id));
    }
    setIsRemoveModalOpen(false); // Close the modal
    setCardToRemove(null); // Reset the card to remove
  };

  return (
    <div className="pack-opening-container">
      <h2>Open a Booster Pack</h2>
      {isInitialLoading ? (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner />
          <div style={{ color: '#555', marginLeft: '10px' }}>Loading...</div>
        </div>
      ) : !packClicked ? (
        <div
          className="booster-pack-container"
          onClick={handlePackClick}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '3vh auto',
            width: '15vw',
            height: 'auto',
          }}
        >
          <img
            src={boosterPackImage}
            alt="Booster Pack"
            className={isTearing ? 'tearing' : ''}
            style={{
              width: '25vw',
              height: 'auto',
              transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
              transform: packZoomed ? 'scale(1.5)' : 'scale(1)',
              opacity: packClicked ? 0 : 1,
            }}
          />
          {packClicked && packHalves && (
            <div className="booster-pack-split-container">
              <div className="pack-half top" style={packHalves.top}></div>
              <div className="pack-half bottom" style={packHalves.bottom}></div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: packClicked ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
          {isOpening ? <LoadingSpinner /> : <div style={{ color: '#555', fontSize: '1.2em' }}>Opening Pack...</div>}
        </div>
      )}
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '1px solid #ccc' }} />
      {openedCards.length > 0 && (
        <p className="pack-value-text">
          Estimated Pack Value (Avg): ${totalPackValue}
        </p>
      )}
      {error && <p className="error-message">{error}</p>}

      {isModalOpen ? (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            {openedCards.map((card, index) => {
              let cardClass = 'modal-card';
              if (index < revealedCardIndex) {
                cardClass += ' hidden';
              } else if (index === revealedCardIndex) {
                cardClass += ' revealed';
              }
              return (
                <div
                  key={card.id}
                  className={cardClass}

                >
                  <img src={card.images.large} alt={card.name} />
                </div>
              );
            })}
            {revealedCardIndex === openedCards.length - 1 && (
              <button className="add-all-button" onClick={handleAddAllToCollection}>
                Register to Pokedex
              </button>
            )}
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
                  <img src={card.images.large} alt={card.name} />
                  {hoveredCardIndex === index && card?.cardmarket?.prices && (
                    <div className="card-info">
                      <p><strong>Avg Price:</strong> ${card.cardmarket.prices.averageSellPrice}</p>
                      <p><strong>Low Price:</strong> ${card.cardmarket.prices.lowPrice}</p>
                      <p><strong>Trend Price:</strong> ${card.cardmarket.prices.trendPrice}</p>
                      <p><strong>Updated:</strong> {card?.cardmarket?.updatedAt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              <button className="add-all-button" onClick={handleAddAllToCollection}>
                Register to Pokedex
              </button>
            </div>
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
