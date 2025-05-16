import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Simulate a small initial load time if needed, or remove the setTimeout
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

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
    setIsOpening(true);
    setOpenedCards([]);
    setError(null);
    const numberOfCardsInPack = 10;
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
    if (!isOpening && !packClicked) {
      setPackClicked(true);
      setPackZoomed(true);
      setTimeout(() => {
        openPack();
      }, 300);
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
  };

  useEffect(() => {
    if (!isModalOpen && packClicked) {
      setPackClicked(false);
      setPackZoomed(false);
    }
  }, [isModalOpen, packClicked]);

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
            maxWidth: '220px',
            height: 'auto',
          }}
        >
          <img
            src={boosterPackImage}
            alt="Booster Pack"
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
              transform: packZoomed ? 'scale(1.5)' : 'scale(1)',
              opacity: packClicked ? 0 : 1,
            }}
          />
        </div>
      ) : (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: packClicked ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}>
          {isOpening ? <LoadingSpinner /> : <div style={{ color: '#555', fontSize: '1.2em' }}>Opening Pack...</div>}
        </div>
      )}
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '1px solid #ccc' }} />
      {error && <p className="error-message">{error}</p>}

      {isModalOpen ? (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            {openedCards.map((card, index) => (
              <div
                key={card.id}
                className={`modal-card card-${index}`}
                style={{
                  zIndex: index === revealedCardIndex ? openedCards.length : openedCards.length - 1 - index,
                  top: `${index * 5}%`,
                  left: `${index * 5}%`,
                  opacity: index < revealedCardIndex ? 0 : 1,
                  transform: index === revealedCardIndex ? 'translate(0, 0) scale(3)' : (index < revealedCardIndex ? 'translateX(-120%) scale(1)' : 'translate(10px, 10px) scale(1)'),
                  transition: 'opacity 0.4s ease-in-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0s 0.5s'
                }}
              >
                <img src={card.images.large} alt={card.name} />
              </div>
            ))}
            {revealedCardIndex === openedCards.length - 1 && (
              <button className="add-all-button" onClick={handleAddAllToCollection}>
                Add All to Collection
              </button>
            )}
          </div>
        </div>
      ) : ( 
        openedCards.length > 0 && (
          <>
            <div className="opened-cards">
              {openedCards.map((card, index) => (
                <div key={card.id} className={`opened-card card-${index}`} style={{ animationDelay: `${index * 0.5}s` }}>
                  <img src={card.images.large} alt={card.name} />
                </div>
              ))}
            </div>
            <div>
              <button className="add-all-button" onClick={handleAddAllToCollection}>
                Add All to Collection
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default PackOpening;