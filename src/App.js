import React, { useState } from 'react';
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import Layout from './components/Layout'; // Import the Layout component
import './App.css';
import useCollection from './hooks/useCollection';
import Slideshow from './components/Slideshow'; // Add this import

function App() {
  const { collection, addToCollection, removeFromCollection, removeAllFromCollection } = useCollection();
  const [selectedCard, setSelectedCard] = useState(null);

  const openCardDetails = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  return (
    <Layout>
      <Slideshow />
      <div id="pack-opening-section">
        <PackOpening addToCollection={addToCollection} />
      </div>        
      <div id="card-gallery-section">
        <CardGallery
          collection={collection}
          openCardDetails={openCardDetails}
          removeFromCollection={removeFromCollection}
          removeAllFromCollection={removeAllFromCollection}
        />
      </div>
      {selectedCard && <CardDetails card={selectedCard} onClose={closeCardDetails} />}
    </Layout>
  );
}

export default App;
