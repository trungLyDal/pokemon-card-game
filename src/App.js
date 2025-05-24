import React, { useState } from 'react';
import useServerStatus from './hooks/useServerStatus'; 
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import Layout from './components/Layout';
import './App.css';
import useCollection from './hooks/useCollection';
import Slideshow from './components/Slideshow';
import Separator from './components/Separator';
import FakeLoading from './components/FakeLoading'; // Import the new loading component

function App() {
  const serverReady = useServerStatus();
  const { collection, addToCollection, addManyToCollection, removeFromCollection, removeAllFromCollection } = useCollection();
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const openCardDetails = (card) => setSelectedCard(card);
  const closeCardDetails = () => setSelectedCard(null);

  // Show FakeLoading until server is ready or fake loading completes
  if (!serverReady && !loadingComplete) {
    return (
<FakeLoading serverReady={serverReady} onComplete={() => setLoadingComplete(true)} />
    );
  }

  // If loading is complete but server is not ready, still show message or fallback
  if (!serverReady && loadingComplete) {
    return (
      <div className="loading-screen">
        <h2>Server still waking up...</h2>
        <p>Please wait a moment more.</p>
      </div>
    );
  }

  return (
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
  );
}

export default App;
