// src/App.js
import React, { useState } from 'react';
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import ScrollToTopButton from './components/ScrollToTopButton'; // Import the new component
import './App.css';
import useCollection from './hooks/useCollection';

function App() {
  const { collection, addToCollection, removeFromCollection, removeAllFromCollection } = useCollection(); // Destructure removeAllFromCollection
  const [selectedCard, setSelectedCard] = useState(null);

  const openCardDetails = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  return (
    <div className="app-container">
      <h1>Digital Pokémon Card Collection</h1>
      <PackOpening addToCollection={addToCollection} />
      <CardGallery
        collection={collection}
        openCardDetails={openCardDetails}
        removeFromCollection={removeFromCollection}
        removeAllFromCollection={removeAllFromCollection} // Pass it as a prop
      />
      {selectedCard && <CardDetails card={selectedCard} onClose={closeCardDetails} />}
      <ScrollToTopButton /> {/* Render the ScrollToTopButton */}
    </div>
  );
}

export default App;