// App.js (remains unchanged from previous solution)
import React, { useState, useEffect } from 'react';
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import Layout from './components/Layout';
import './App.css';
import useCollection from './hooks/useCollection';
import Slideshow from './components/Slideshow';
import Separator from './components/Separator';
import LoadingSpinner from './components/LoadingSpinner'; // Renamed to reflect your component name

function App() {
  const { collection, addToCollection, addManyToCollection, removeFromCollection, removeAllFromCollection } = useCollection();
  const [selectedCard, setSelectedCard] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Failed to load initial app data or resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    simulateLoading();
    return () => {};
  }, []);

  const openCardDetails = (card) => {
    setSelectedCard(card);
  };

  const closeCardDetails = () => {
    setSelectedCard(null);
  };

  return (
    <>
      {isLoading ? (
        // Pass the isFullScreen prop to make it full-screen and centered
        <LoadingSpinner isFullScreen={true} />
      ) : (
        <Layout>
          <Slideshow />
          <div className="section-separator"></div>
          <div id="pack-opening-section">
            <PackOpening
              addToCollection={addToCollection}
              addManyToCollection={addManyToCollection}
              collection={collection}
            />
          </div>
          <Separator />
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
      )}
    </>
  );
}

export default App;