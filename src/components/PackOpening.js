// src/components/PackOpening.js
import React, { useState } from 'react';
import './PackOpening.css';
import LoadingSpinner from './LoadingSpinner';
import cardData from '../data/all_pokemon_cards.json';



const PackOpening = ({ addToCollection }) => {
  const [openedCards, setOpenedCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState(null);

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

    for (let i = 0; i < numberOfCardsInPack; i++) {
      let randomCard = await fetchRandomCard();
      if (randomCard) {
        while (drawnCardIds.has(randomCard.id)) {
          randomCard = await fetchRandomCard();
          if (!randomCard) break;
        }

        if (randomCard) {
          drawnCardIds.add(randomCard.id);
          await new Promise(resolve => setTimeout(resolve, 550));
          setOpenedCards(prevCards => [...prevCards, randomCard]);
        } else {
          setIsOpening(false);
          return;
        }
      } else {
        setIsOpening(false);
        return;
      }
    }
    setIsOpening(false);
  };

  const handleAddAllToCollection = () => {
    openedCards.forEach(card => {
      addToCollection(card);
    });
    setOpenedCards([]); // Clear the opened cards after adding all
  };

  return (
    <div className="pack-opening-container">
      <h2>Open a Booster Pack</h2>
      <button onClick={openPack} disabled={isOpening}>
        {isOpening ? <LoadingSpinner /> : 'Open Pack'}
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="opened-cards">
        {openedCards.map((card, index) => (
          <div key={card.id} className={`opened-card card-${index}`} style={{ animationDelay: `${index * 0.5}s` }}>
            <img src={card.images.small} alt={card.name} />
          </div>
        ))}
      </div>
      {openedCards.length > 0 && (
        <button className="add-all-button" onClick={handleAddAllToCollection}>
          Add All to Collection
        </button>
      )}
    </div>
  );
};

export default PackOpening;