// src/App.js
import React, { useState } from 'react';
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import './App.css';
import useCollection from './hooks/useCollection';

function App() {
  const { collection, addToCollection, removeFromCollection } = useCollection();
  const [selectedCard, setSelectedCard] = useState(null);

  const openCardDetails = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  return (
    <div className="app-container">
      <h1>My Digital Pokémon Card Collection</h1>
      <PackOpening addToCollection={addToCollection} />
      <CardGallery collection={collection} openCardDetails={openCardDetails} removeFromCollection={removeFromCollection} />
      {selectedCard && <CardDetails card={selectedCard} onClose={closeCardDetails} />}
    </div>
  );
}

export default App;