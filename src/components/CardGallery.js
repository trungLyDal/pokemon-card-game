import React, { useState, useEffect, useRef } from 'react';
import './CardGallery.css';
import XIcon from '../assets/images/XIcon.png';
import { FaFilter } from "react-icons/fa";


const CardGallery = ({ collection, cardData, openCardDetails, removeFromCollection, removeAllFromCollection }) => {
  const [filter, setFilter] = useState('');
  const [filteredCollection, setFilteredCollection] = useState(collection);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [cardToRemoveId, setCardToRemoveId] = useState(null);
  const [isRemoveAllModalOpen, setIsRemoveAllModalOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [totalCollectionValue, setTotalCollectionValue] = useState(0); // New state for total collection value
  const [mostValuableCard, setMostValuableCard] = useState(null); // State for most valuable card
  const [leastValuableCard, setLeastValuableCard] = useState(null); // State for least valuable card
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(12); // Adjust this number as needed
    const [showDropdown, setShowDropdown] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const dropdownRef = useRef(null);

useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

   const allTypes = Array.from(
    new Set(collection.flatMap(card => card.types || []))
  ).sort();

  useEffect(() => {
    let filtered = collection.filter(cardObj =>
      cardObj.name.toLowerCase().includes(filter.toLowerCase()) ||
      (cardObj.types && cardObj.types.some(type => type.toLowerCase().includes(filter.toLowerCase()))) ||
      (cardObj.rarity && cardObj.rarity.toLowerCase().includes(filter.toLowerCase())) ||
      (cardObj.set && cardObj.set.name.toLowerCase().includes(filter.toLowerCase())) ||
      (cardObj.cardmarket && cardObj.cardmarket.prices && cardObj.cardmarket.prices.averageSellPrice.toString().includes(filter))
    );
    if (typeFilter) {
      filtered = filtered.filter(card => (card.types || []).includes(typeFilter));
    }
    if (sortOption === 'priceHighLow') {
      filtered = [...filtered].sort((a, b) =>
        (b?.cardmarket?.prices?.averageSellPrice || 0) - (a?.cardmarket?.prices?.averageSellPrice || 0)
      );
    } else if (sortOption === 'priceLowHigh') {
      filtered = [...filtered].sort((a, b) =>
        (a?.cardmarket?.prices?.averageSellPrice || 0) - (b?.cardmarket?.prices?.averageSellPrice || 0)
      );
    }
    setFilteredCollection(filtered);
  }, [collection, filter, sortOption, typeFilter]);

  useEffect(() => {
    const filtered = collection.filter(cardObj =>
      cardObj.name.toLowerCase().includes(filter.toLowerCase()) ||
      (cardObj.types && cardObj.types.some(type => type.toLowerCase().includes(filter.toLowerCase()))) ||
      (cardObj.rarity && cardObj.rarity.toLowerCase().includes(filter.toLowerCase())) ||
      (cardObj.set && cardObj.set.name.toLowerCase().includes(filter.toLowerCase())) ||
      (cardObj.cardmarket && cardObj.cardmarket.prices && cardObj.cardmarket.prices.averageSellPrice.toString().includes(filter))
    );
    setFilteredCollection(filtered);
  }, [collection, filter]);

  useEffect(() => {
    // Calculate total collection value (all cards)
    const totalValue = collection.reduce((sum, cardObj) => {
      return sum + (cardObj?.cardmarket?.prices?.averageSellPrice || 0);
    }, 0);
    setTotalCollectionValue(totalValue.toFixed(2));

    // Find the most valuable card
    const valuableCard = collection.reduce((mostValuable, currentCard) => {
      const currentPrice = currentCard?.cardmarket?.prices?.averageSellPrice || 0;
      const mostValuablePrice = mostValuable?.cardmarket?.prices?.averageSellPrice || 0;
      return currentPrice > mostValuablePrice ? currentCard : mostValuable;
    }, null);
    setMostValuableCard(valuableCard);

    // Find the least valuable card
    const leastValuable = collection.reduce((leastValuableCard, currentCard) => {
      const currentPrice = currentCard?.cardmarket?.prices?.averageSellPrice || 0;
      const leastValuablePrice = leastValuableCard?.cardmarket?.prices?.averageSellPrice || Infinity; // Changed initial value and variable name
      if (leastValuableCard === null) {
        return currentCard;
      }
      return currentPrice < leastValuablePrice ? currentCard : leastValuableCard;
    }, null);
    setLeastValuableCard(leastValuable);
  }, [collection]); // Recalculate when the main collection changes


  const totalCards = collection.length;
  const totalCardsText = ` ${totalCards}`;

  const handleCardMouseEnter = (cardId) => {
    setHoveredCardId(cardId);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardId(null);
  };

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

  // Update these handlers
  const handleLeastValuablePriceClick = (event) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event from bubbling up
    if (leastValuableCard) {
      const pokemonName = encodeURIComponent(leastValuableCard.name);
      window.open(`https://pokemoncardprices.io/card-info/${pokemonName}`, '_blank');
    }
  };

  const handleMostValuablePriceClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (mostValuableCard) {
      const pokemonName = encodeURIComponent(mostValuableCard.name);
      window.open(`https://pokemoncardprices.io/card-info/${pokemonName}`, '_blank');
    }
  };

  // Calculate current cards to display
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCollection.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCollection.length / cardsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.querySelector('.card-grid').offsetTop - 100,
      behavior: 'smooth'
    });
  };
  function getPageNumbers(currentPage, totalPages) {
  const delta = 2; 
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l > 2) {
        rangeWithDots.push('ellipsis');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

  // Helper to get the full card info from cardData
  function getFullCard(card) {
    return cardData.find(c => c.id === card.id) || card;
  }

  // Helper to get the best image URL for a card
  function getCardImage(card) {
    const fullCard = getFullCard(card);
    if (fullCard.images?.large) return fullCard.images.large;
    if (fullCard.image?.large) return fullCard.image.large;
    if (fullCard.images?.small) return fullCard.images.small;
    if (fullCard.image?.small) return fullCard.image.small;
    if (typeof fullCard.image === 'string') return fullCard.image;
    if (typeof fullCard.images === 'string') return fullCard.images;
    return '';
  }

  return (
    <div className="card-gallery-container">
      <h2>My Collection</h2>
      <button className="remove-everything-button" onClick={openRemoveAllConfirmation}>
        Remove Entire Collection
      </button>
      <div className="collection-info">
  <p className="pokemon-type-box">
    <strong>Total:</strong>{totalCardsText}
  </p>
  <p className="pokemon-type-box">
    <strong>Total Collection Value (Avg):</strong> ${totalCollectionValue}
  </p>

  {/* Most Valuable Card Paragraph */}
  <p
    className="pokemon-type-box clickable-paragraph" // Added clickable-paragraph for styling
    onClick={() => {
      if (mostValuableCard) { // Ensure card exists before calling
        openCardDetails(mostValuableCard);
      }
    }}
  >
    {mostValuableCard ? (
      <span>
        {/* The name part is no longer independently clickable for openCardDetails */}
        <span>
          <strong>Most Valuable Card: </strong>{mostValuableCard.name}
        </span>
        {" "}({" "}
        <span
          className="price-link-most clickable" // Keep this for specific price action
          onClick={(e) => {
            e.stopPropagation(); // VERY IMPORTANT: Prevents the <p>'s onClick from firing
            handleMostValuablePriceClick(e); // Your existing handler for price
          }}
        >
          ${mostValuableCard?.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 0}
        </span>
        {" "})
      </span>
    ) : (
      <span className="placeholder-text">No cards yet</span>
    )}
  </p>

  {/* Least Valuable Card Paragraph */}
  <p
    className="pokemon-type-box clickable-paragraph" // Added clickable-paragraph for styling
    onClick={() => {
      if (leastValuableCard) { // Ensure card exists before calling
        openCardDetails(leastValuableCard);
      }
    }}
  >
    {leastValuableCard ? (
      <span>
        {/* The name part is no longer independently clickable for openCardDetails */}
        <span>
          <strong>Least Valuable Card: </strong>{leastValuableCard.name}
        </span>
        {" "} ({" "}
        <span
          className="price-link-least clickable" // Keep this for specific price action
          onClick={(e) => {
            e.stopPropagation(); // VERY IMPORTANT: Prevents the <p>'s onClick from firing
            handleLeastValuablePriceClick(e); // Your existing handler for price
          }}
        >
          ${leastValuableCard?.cardmarket?.prices?.averageSellPrice?.toFixed(2) || 0}
        </span>
        )
      </span>
    ) : (
      <span className="placeholder-text">No cards yet</span>
    )}
  </p>
</div>
      <div className="filter-section">
        <div className="filter-input-wrapper">
          <input
            type="text"
            id="filter"
            placeholder="Name, Type, Rarity, Set, Prices..."
            value={filter}
            onChange={handleFilterChange}
            className="filter-input"
          />
          
          {filter && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => setFilter('')}
              aria-label="Clear filter"
            >
              <img src={XIcon} alt="Clear" className="xicon-img" />
            </button>
          )}
        </div>
               <button
    id="filterType"
    
    onClick={e => {e.stopPropagation(); setShowDropdown(v => !v)}}
    type="button"
    aria-label="Show filter options"
  >
    <FaFilter />
  </button>
  {showDropdown && (
    <div className="filter-dropdown" ref={dropdownRef}>
      <div className="dropdown-section">
        <span className="dropdown-label">Sort by Price:</span>
        <button
          className={sortOption === 'priceHighLow' ? 'active' : ''}
          onClick={() => { setSortOption('priceHighLow'); setShowDropdown(false); }}
        >High → Low</button>
        <button
          className={sortOption === 'priceLowHigh' ? 'active' : ''}
          onClick={() => { setSortOption('priceLowHigh'); setShowDropdown(false); }}
        >Low → High</button>
      </div>
      <div className="dropdown-section">
        <span className="dropdown-label">Filter by Type:</span>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setShowDropdown(false); }}
        >
          <option value="">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {(sortOption || typeFilter) && (
        <button className="dropdown-clear" onClick={() => { setSortOption(''); setTypeFilter(''); }}>
          Clear Filters
        </button>
      )}
    </div>
  )}
        </div>
      <div className="card-grid">
        {currentCards.map(cardObj => {
          const glowClass = cardObj.types && cardObj.types[0] ? `glow-${cardObj.types[0].toLowerCase()}` : '';
          return (
            <div
              key={cardObj.id}
              className={`card-item ${glowClass} ${cardObj.rarity?.includes('Rare Holo') ? 'rare-holo' : ''}`}
              onMouseEnter={() => handleCardMouseEnter(cardObj.id)}
              onMouseLeave={handleCardMouseLeave}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
<img
  src={getCardImage(cardObj)}
  alt={cardObj.name}
  onClick={() => openCardDetails(cardObj)}
  style={{ cursor: 'pointer' }}
/>              {cardObj.count > 1 && <div className="card-count">{cardObj.count}</div>}
              <div className="card-actions">
                <button className="remove-button" onClick={() => openRemoveConfirmation(cardObj.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
              {hoveredCardId === cardObj.id && cardObj?.cardmarket?.prices?.averageSellPrice && (
                <div className="hover-price-box">
                  ${cardObj.cardmarket.prices.averageSellPrice}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filteredCollection.length === 0 && collection.length > 0 && <p>No cards match your filter.</p>}
      {collection.length === 0 && <p>Your collection is empty. Open some packs!</p>}

      {/* Remove Card Confirmation Modal */}
      {isRemoveModalOpen && (
        <div className="modal-overlay-confirmation">
          <div className="modal-content-confirmation">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this card from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveCard}>Yes</button>
              <button className="cancel-button" onClick={closeRemoveModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove All Confirmation Modal */}
      {isRemoveAllModalOpen && (
        <div className="modal-overlay-confirmation">
          <div className="modal-content-confirmation">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove ALL cards from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveAll}>Yes</button>
              <button className="cancel-button" onClick={closeRemoveAllModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add pagination controls */}
      {filteredCollection.length > cardsPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
         <div className="page-numbers">
  {getPageNumbers(currentPage, totalPages).map((item, idx) =>
    item === 'ellipsis' ? (
      <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
    ) : (
      <button
        key={item}
        onClick={() => paginate(item)}
        className={`page-number ${currentPage === item ? 'active' : ''}`}
      >
        {item}
      </button>
    )
  )}
</div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CardGallery;

