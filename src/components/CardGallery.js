// src/components/CardGallery.js
import React, { useState, useEffect } from 'react';
import './CardGallery.css';

const CardGallery = ({ collection, openCardDetails, removeFromCollection }) => {
  const [filter, setFilter] = useState('');
  const [filteredCollection, setFilteredCollection] = useState(collection);

  useEffect(() => {
    const filtered = collection.filter(cardObj => // Filter based on the card object now
      cardObj.name.toLowerCase().includes(filter.toLowerCase()) ||
      (cardObj.types && cardObj.types.some(type => type.toLowerCase().includes(filter.toLowerCase()))) ||
      (cardObj.rarity && cardObj.rarity.toLowerCase().includes(filter.toLowerCase())) ||
      (cardObj.set && cardObj.set.name.toLowerCase().includes(filter.toLowerCase()))
    );
    setFilteredCollection(filtered);
  }, [collection, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleRemoveCard = (cardId) => {
    removeFromCollection(cardId);
  };

  return (
    <div className="card-gallery-container">
      <h2>My Collection</h2>
      <div className="filter-section">
        <label htmlFor="filter">Filter Cards:</label>
        <input
          type="text"
          id="filter"
          placeholder="Name, Type, Rarity, Set..."
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>
      <div className="card-grid">
        {filteredCollection.map(cardObj => ( // Map over card objects
          <div
            key={cardObj.id}
            className={`card-item ${cardObj.rarity?.includes('Rare Holo') ? 'rare-holo' : ''}`}
          >
            <img src={cardObj.images.small} alt={cardObj.name} onClick={() => openCardDetails(cardObj)} style={{ cursor: 'pointer' }} />
            <div className="card-count">{cardObj.count}</div> {/* Display the count */}
            <button className="remove-button" onClick={() => handleRemoveCard(cardObj.id)}>Remove</button>
          </div>
        ))}
      </div>
      {filteredCollection.length === 0 && collection.length > 0 && <p>No cards match your filter.</p>}
      {collection.length === 0 && <p>Your collection is empty. Open some packs!</p>}
    </div>
  );
};

export default CardGallery;