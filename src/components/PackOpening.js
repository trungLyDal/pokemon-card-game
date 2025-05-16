// src/components/PackOpening.js
import React, { useState } from 'react';
import axios from 'axios';
import './PackOpening.css';
import LoadingSpinner from './LoadingSpinner';

const PackOpening = ({ addToCollection }) => {
  const [openedCards, setOpenedCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomCard = async () => {
    try {
      const apiKey = process.env.REACT_APP_POKEMON_TCG_API_KEY;
      const headers = apiKey ? { 'X-Api-Key': apiKey } : {};
      const response = await axios.get('https://api.pokemontcg.io/v2/cards?pageSize=10', { headers });
      console.log('Larger Batch Card Response:', response);
      if (response.data && response.data.data && response.data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.data.length);
        return response.data.data[randomIndex];
      } else {
        console.warn('No card data received from larger batch request:', response.data);
        setError('Failed to fetch random cards (empty larger batch). Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching larger card batch:', error);
      setError(`Failed to fetch random cards: ${error.message}`);
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

  const handleAddToCollection = (cardToAdd) => {
    addToCollection(cardToAdd);
    setOpenedCards(prevOpenedCards =>
      prevOpenedCards.filter(openedCard => openedCard.id !== cardToAdd.id)
    );
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