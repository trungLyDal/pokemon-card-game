// src/App.js
import React, { useState } from 'react';
import useServerStatus from './hooks/useServerStatus';
import PackOpening from './components/PackOpening';
import CardGallery from './components/CardGallery';
import CardDetails from './components/CardDetails';
import Layout from './components/Layout';
import './App.css';
import useCollection from './hooks/useCollection';
import Slideshow from './components/Slideshow';
import TutorialCallout from './components/TutorialCallout'; 
import Separator from './components/Separator';

function App() {
  const { collection, addToCollection, addManyToCollection, removeFromCollection, removeAllFromCollection } = useCollection();
  const [selectedCard, setSelectedCard] = useState(null);

  const openCardDetails = (card) => setSelectedCard(card);
  const closeCardDetails = () => setSelectedCard(null);

  // if (!serverReady && !loadingComplete) {
  //   return (
  //     <FakeLoading serverReady={serverReady} onComplete={() => setLoadingComplete(true)} />
  //   );
  // }

  // if (!serverReady && loadingComplete) {
  //   return (
  //     <div className="loading-screen">
  //       <h2>Server still waking up...</h2>
  //       <p>Please wait a moment more.</p>
  //     </div>
  //   );
  // }

  return (
    <Layout>
      <Slideshow />
      <div className="section-separator"></div> 
      <TutorialCallout /> 
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