// src/components/CardGallery.js
import React, { useState, useEffect } from 'react';
import './CardGallery.css';

const CardGallery = ({ collection, openCardDetails, removeFromCollection, removeAllFromCollection }) => {
  const [filter, setFilter] = useState('');
  const [filteredCollection, setFilteredCollection] = useState(collection);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [cardToRemoveId, setCardToRemoveId] = useState(null);
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);

  useEffect(() => {
    const filtered = collection.filter(cardObj =>
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

  const openRemoveConfirmation = (cardId) => {
    setCardToRemoveId(cardId);
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveCard = () => {
    if (cardToRemoveId !== null) {
      removeFromCollection(cardToRemoveId);
      setCardToRemoveId(null);
    }
    setIsRemoveModalOpen(false);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setCardToRemoveId(null);
  };

  const openRemoveAllConfirmation = () => {
    setIsRemoveAllModalOpen(true);
  };

  const confirmRemoveAll = () => {
    removeAllFromCollection();
    setIsRemoveAllModalOpen(false);
  };

  const closeRemoveAllModal = () => {
    setIsRemoveAllModalOpen(false);
  };

  return (
    <div className="card-gallery-container">
      <h2>My Collection</h2>
      <button className="remove-everything-button" onClick={openRemoveAllConfirmation}>
        Remove Entire Collection
      </button>
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
        {filteredCollection.map(cardObj => {
  const glowClass = cardObj.types && cardObj.types[0] ? `glow-${cardObj.types[0].toLowerCase()}` : '';
  return (
    <div
      key={cardObj.id}
      className={`card-item ${glowClass} ${cardObj.rarity?.includes('Rare Holo') ? 'rare-holo' : ''}`}
    >
      <img src={cardObj.images.small} alt={cardObj.name} onClick={() => openCardDetails(cardObj)} style={{ cursor: 'pointer' }} />
      {cardObj.count > 1 && <div className="card-count">{cardObj.count}</div>}
      <div className="card-actions">
        <button className="remove-button" onClick={() => openRemoveConfirmation(cardObj.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

        </button>
      </div>
    </div>
  );
})}
      </div>
      {filteredCollection.length === 0 && collection.length > 0 && <p>No cards match your filter.</p>}
      {collection.length === 0 && <p>Your collection is empty. Open some packs!</p>}

      {/* Remove Card Confirmation Modal */}
      {isRemoveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this card from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveCard}>Yes, Remove</button>
              <button className="cancel-button" onClick={closeRemoveModal}>No, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove All Confirmation Modal */}
      {isRemoveAllModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove ALL cards from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveAll}>Yes, Remove All</button>
              <button className="cancel-button" onClick={closeRemoveAllModal}>No, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGallery;