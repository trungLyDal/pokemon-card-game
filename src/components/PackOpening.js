import { useState, useEffect } from 'react';
import './PackOpening.css';
import LoadingSpinner from './LoadingSpinner';
import boosterPackImage from '../assets/images/boosterPackScarletandViolet.webp';
import PackToggle from "./PackToggle";
import skipIcon from '../assets/images/skip-track.png';
import fallbackPokemonData from '../data/all_pokemon_cards.json';

const PackOpening = ({ addToCollection, addManyToCollection, collection }) => {
  // State variables for managing the pack opening process and UI
  const [openedCards, setOpenedCards] = useState([]); // Stores the cards revealed from the pack
  const [isOpening, setIsOpening] = useState(false); // True when a pack is actively being opened
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the card reveal modal
  const [packClicked, setPackClicked] = useState(false); // True after the booster pack is clicked
  const [revealedCardIndex, setRevealedCardIndex] = useState(-1); // Index of the currently revealed card in the modal
  const [packZoomed, setPackZoomed] = useState(false); // Controls zoom animation for the pack
  const [isInitialLoading, setIsInitialLoading] = useState(true); // For initial app loading spinner
  const [isTearing, setIsTearing] = useState(false); // Controls the tearing animation of the pack
  const [packHalves, setPackHalves] = useState(null); // Stores styles for the two halves of the torn pack
  const [isSplitting, setIsSplitting] = useState(false); // Controls the splitting animation of the pack
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null); // Index of the card being hovered over
  const [totalPackValue, setTotalPackValue] = useState(0); // Calculated total value of cards in the opened pack
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // Controls visibility of card removal confirmation modal
  const [cardToRemove, setCardToRemove] = useState(null); // Stores the card to be removed
  const [error, setError] = useState(null); // Stores any error messages to display to the user
  const [packsToOpen, setPacksToOpen] = useState(1); // Number of booster packs to open (controlled by PackToggle)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false); // Controls a general loading screen
  const [cardData, setCardData] = useState([]); // Stores all available card data (from API or fallback)
  const [isLoadingCards, setIsLoadingCards] = useState(true); // True while card data is being fetched/loaded

  // Base URL for the backend API, defaults to localhost if not set in environment variables
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  /**
   * useEffect hook to fetch all card data from the backend API.
   * Includes a fallback mechanism to use local JSON data if the API call fails.
   */
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Attempt to fetch cards from the API
        const res = await fetch(`${API_BASE_URL}/api/cards?page=1&limit=10000`);
        // Check if the response was successful (HTTP status 200-299)
        if (!res.ok) {
          // If not successful, throw an error to trigger the catch block
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json(); // Parse the JSON response
        console.log("✅ Successfully fetched cards from server:", data);
        setCardData(data.cards); // Set the fetched card data to state
      } catch (err) {
        // If an error occurs during fetch (e.g., network error, server down, HTTP error)
        console.error("❌ Failed to fetch cards from server:", err);
        setCardData(fallbackPokemonData); // Use the imported local fallback data
      } finally {
        setIsLoadingCards(false); // Always set loading to false after attempt
      }
    };

    fetchCards(); // Call the async fetch function
  }, [API_BASE_URL]); // Dependency array: re-run if API_BASE_URL changes

  /**
   * useEffect hook for an initial loading spinner, providing a brief delay
   * before the main content is displayed.
   */
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 500);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []); // Empty dependency array means this runs once on mount

  /**
   * useEffect hook to calculate the total estimated value of the opened cards.
   * Recalculates whenever 'openedCards' changes.
   */
  useEffect(() => {
    if (openedCards.length > 0) {
      const total = openedCards.reduce((sum, card) => (
        // Safely access averageSellPrice, defaulting to 0 if not available
        sum + (card?.cardmarket?.prices?.averageSellPrice || 0)
      ), 0);
      setTotalPackValue(total.toFixed(2)); // Format to 2 decimal places
    } else {
      setTotalPackValue(0); // Reset if no cards are opened
    }
  }, [openedCards]); // Dependency array: re-run when openedCards changes

  // Event handler for mouse entering a card to show info
  const handleCardMouseEnter = (index) => setHoveredCardIndex(index);
  // Event handler for mouse leaving a card to hide info
  const handleCardMouseLeave = () => setHoveredCardIndex(null);

  /**
   * Function to draw a random card from the loaded 'cardData'.
   * Ensures 'cardData' is available before attempting to draw.
   * @returns {Object|null} A random card object or null if no data is available.
   */
  const fetchRandomCard = () => {
    if (cardData && cardData.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardData.length);
      return cardData[randomIndex];
    }
    return null;
  };

  /**
   * Skips all card reveal animations in the modal, showing all cards instantly
   * and then closing the modal after a short delay.
   */
  const handleSkipAll = () => {
    setRevealedCardIndex(openedCards.length - 1); // Set to last card to reveal all
    setTimeout(() => setIsModalOpen(false), 100); // Close modal shortly after
  };

  /**
   * Initiates the pack opening process, drawing a set number of cards
   * and managing the loading and display states.
   */
  const openPack = async () => {
    // Prevent opening if there are uncollected cards or still loading
    if (openedCards.length > 0 && !isModalOpen) {
      setError("You must add the current cards to your collection before opening another pack!");
      return;
    }

    setIsOpening(true); // Indicate pack opening has started
    setShowLoadingScreen(true); // Show general loading screen
    setOpenedCards([]); // Clear previously opened cards
    setError(null); // Clear any previous errors

    const drawnCardIds = new Set(); // To track unique card IDs within a pack
    const newOpenedCards = []; // Array to store the newly drawn cards
    const numberOfPacks = packsToOpen;
    const numberOfCardsInPack = 5; // Standard number of cards per pack

    // Loop to draw cards for the specified number of packs
    for (let i = 0; i < numberOfPacks * numberOfCardsInPack; i++) {
      let randomCard = fetchRandomCard(); // Draw a random card
      if (randomCard) {
        // Optional: Ensure no duplicates in this specific pack.
        // This 'while' loop keeps drawing until a unique card is found for the current pack.
        while (drawnCardIds.has(randomCard.id)) {
          randomCard = fetchRandomCard();
          if (!randomCard) break; // Break if no more unique cards can be found (unlikely with large dataset)
        }
        if (randomCard) {
          drawnCardIds.add(randomCard.id); // Add card ID to set of drawn IDs
          newOpenedCards.push(randomCard); // Add card to the new opened cards array
        } else {
          // Handle case where no random card could be fetched (e.g., cardData is empty)
          setIsOpening(false);
          setShowLoadingScreen(false);
          return;
        }
      } else {
        // Handle case where fetchRandomCard returns null
        setIsOpening(false);
        setShowLoadingScreen(false);
        return;
      }
    }

    // After a short delay, set the opened cards and show the modal
    setTimeout(() => {
      setOpenedCards(newOpenedCards);
      setIsOpening(false);
      setShowLoadingScreen(false);
      setIsModalOpen(true); // Open the modal to reveal cards
      setRevealedCardIndex(0); // Start revealing from the first card
    }, 1000); // 1-second delay before cards appear
  };

  /**
   * Handles the click event on the booster pack image, triggering animations
   * and then calling 'openPack'.
   */
  const handlePackClick = () => {
    // Prevent interaction if cards are still loading or if a pack is already being opened
    if (isLoadingCards || cardData.length === 0) {
      setError("Cards are still loading. Please wait...");
      return;
    }
    if (openedCards.length > 0 && !isModalOpen) {
      setError("You must add the current cards to your collection before opening another pack!");
      return;
    }
    if (!isOpening && !packClicked && !isSplitting) {
      setPackClicked(true); // Mark pack as clicked
      setIsTearing(true); // Start tearing animation
      setPackZoomed(true); // Start zoom animation

      const packImageElement = document.querySelector('.booster-pack-container img');
      if (packImageElement) {
        const { offsetWidth, offsetHeight } = packImageElement;
        // Set styles for the two halves of the pack for the splitting effect
        setPackHalves({
          top: {
            backgroundImage: `url(${boosterPackImage})`,
            backgroundPosition: 'top center',
            width: offsetWidth,
            height: offsetHeight * 0.2, // Top 20% of the image
            top: 0,
            left: 0,
          },
          bottom: {
            backgroundImage: `url(${boosterPackImage})`,
            backgroundPosition: 'bottom center',
            width: offsetWidth,
            height: offsetHeight * 0.8, // Bottom 80% of the image
            top: offsetHeight * 0.2,
            left: 0,
          },
        });
        // Sequence animations: tearing -> splitting -> openPack
        setTimeout(() => {
          setIsTearing(false); // End tearing animation
          setIsSplitting(true); // Start splitting animation
          document.querySelector('.booster-pack-container').classList.add('splitting'); // Add class for CSS animation
          setTimeout(() => {
            setPackZoomed(false); // End zoom
            openPack(); // Open the pack and reveal cards
            document.querySelector('.booster-pack-container').classList.remove('splitting'); // Remove splitting class
            setPackHalves(null); // Clear pack halves styles
          }, 800); // Delay for splitting animation
        }, 300); // Delay for tearing animation
      }
    }
  };

  /**
   * Handles clicks within the modal to reveal the next card or close the modal.
   */
  const handleModalClick = () => {
    if (isModalOpen && revealedCardIndex < openedCards.length - 1) {
      setRevealedCardIndex(prevIndex => prevIndex + 1); // Reveal next card
    } else if (isModalOpen) {
      setIsModalOpen(false); // Close modal if all cards revealed
    }
  };

  /**
   * Adds all currently opened cards to the user's collection with animations.
   */
  const handleAddAllToCollection = () => {
    const container = document.querySelector('.opened-cards');
    if (packsToOpen === 1) {
      const cards = document.querySelectorAll('.opened-card, .modal-card');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('collecting'); // Add collecting animation class
        }, idx * 80); // Stagger animation for each card
      });
      const button = document.querySelector('.add-all-button');
      if (button) button.classList.add('collecting'); // Animate the button too
      setTimeout(() => {
        addManyToCollection(openedCards); // Add cards to global collection
        setOpenedCards([]); // Clear opened cards state
        setIsModalOpen(false); // Close modal
        setPackClicked(false); // Reset pack clicked state
        setIsSplitting(false); // Reset splitting state
        if (container) {
          // Reset container styles to hide opened cards area
          container.style.height = '0';
          container.style.padding = '0';
          container.style.margin = '0';
        }
      }, (cards.length * 80) + 700); // Total delay for animations to complete
    } else {
      // For multiple packs, skip individual card animations for speed
      addManyToCollection(openedCards);
      setOpenedCards([]);
      setIsModalOpen(false);
      setPackClicked(false);
      setIsSplitting(false);
      if (container) {
        container.style.height = '0';
        container.style.padding = '0';
        container.style.margin = '0';
      }
    }
  };

  /**
   * Scrolls the view back to the top of the pack opening container.
   */
  const handleBacktoOpening = () => {
    document.getElementById('pack-opening-container-header').scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Resets UI states when the modal closes, ensuring the pack opening
   * experience can be restarted.
   */
  useEffect(() => {
    if (!isModalOpen && packClicked) {
      setPackClicked(false);
      setPackZoomed(false);
      setIsSplitting(false);
    }
  }, [isModalOpen, packClicked]); // Re-run when modal state or packClicked changes

  // Closes the card removal confirmation modal
  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setCardToRemove(null);
  };

  // Confirms and performs the removal of a card from the opened cards
  const confirmRemoveCard = () => {
    if (cardToRemove) {
      setOpenedCards(prevCards => prevCards.filter(c => c.id !== cardToRemove.id));
    }
    setIsRemoveModalOpen(false);
    setCardToRemove(null);
  };

  return (
    <div className="pack-opening-container" id="pack-opening-container-header">
      <h2>Open a Booster Pack</h2>
      {/* Display error messages if any */}
      {error && (
        <div className="error-message">{error}</div>
      )}

      {/* Conditional rendering for loading states or the booster pack */}
      {(isInitialLoading || showLoadingScreen || isLoadingCards) ? (
        // Show loading spinner if any loading state is active
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : !packClicked ? (
        // Show the booster pack if not clicked yet
        <div
          className="booster-pack-container"
          onClick={handlePackClick}
          // Disable clicks and reduce opacity if cards are still loading
          style={{ pointerEvents: isLoadingCards ? 'none' : 'auto', opacity: isLoadingCards ? 0.5 : 1 }}
        >
          <img
            src={boosterPackImage}
            alt="Booster Pack"
            // Apply CSS classes for tearing, zooming, and clicked animations
            className={`booster-pack-img${isTearing ? ' tearing' : ''}${packZoomed ? ' zoomed' : ''}${packClicked ? ' clicked' : ''}`}
          />
          {/* Render pack halves during the splitting animation */}
          {packClicked && packHalves && (
            <div className="booster-pack-split-container">
              <div className="pack-half top" style={packHalves.top}></div>
              <div className="pack-half bottom" style={packHalves.bottom}></div>
            </div>
          )}
        </div>
      ) : (
        // Show "Opening Pack..." text or spinner once clicked and opening
        <div className="booster-pack-loading">
          {isOpening ? <LoadingSpinner /> : <div className="booster-pack-loading-text">Opening Pack...</div>}
        </div>
      )}

      {/* Pack Toggle component to select number of packs to open */}
      <div className="pack-toggle-group">
        <PackToggle
          packsToOpen={packsToOpen}
          setPacksToOpen={setPacksToOpen}
          disabled={isOpening || isInitialLoading} // Disable during opening or initial load
        />
      </div>
      <hr style={{ width: '50%', margin: '10px auto', border: '0', borderTop: '3px solid #ccc' }} />

      {/* Conditional rendering for the card reveal modal */}
      {isModalOpen ? (
        <div className="modal-overlay" onClick={handleModalClick}>
          <div className="modal-content">
            {/* Skip All Button for revealing many cards at once */}
            {openedCards.length >= 50 && revealedCardIndex < openedCards.length - 1 && (
              <button
                className="skip-all-btn"
                onClick={e => {
                  e.stopPropagation(); // Prevent modal click from triggering
                  handleSkipAll();
                }}
                aria-label="Skip All Animations"
              >
                <img src={skipIcon} alt="Skip All Animations" style={{ width: 32, height: 32 }} />
              </button>
            )}
            {/* Map through opened cards to display them in the modal */}
            {openedCards.map((card, index) => {
              let cardClass = 'modal-card';
              if (index < revealedCardIndex) {
                cardClass += ' hidden'; // Hide cards already revealed
              } else if (index === revealedCardIndex) {
                cardClass += ' revealed'; // Show the currently revealed card
              }
              return (
                <div key={card.id} className={cardClass}>
                  {/* IMPORTANT: Using card.images.large for the image source */}
                  <img src={card.images.large} alt={card.name} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Display opened cards and value summary after modal closes
        openedCards.length > 0 && (
          <>
            <div className="opened-cards">
              {openedCards.map((card, index) => (
                <div key={card.id} className={`opened-card card-${index}`}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* IMPORTANT: Using card.images.large for the image source */}
                  <img src={card.images.large} alt={card.name} />
                  {/* Display card info on hover */}
                  {hoveredCardIndex === index && card?.cardmarket?.prices && (
                    <div className="card-info">
                      <p><strong>Avg Price:</strong> ${card.cardmarket.prices.averageSellPrice?.toFixed(2)}</p>
                      <p><strong>Low Price:</strong> ${card.cardmarket.prices.lowPrice?.toFixed(2)}</p>
                      <p><strong>Trend Price:</strong> ${card.cardmarket.prices.trendPrice?.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pokemon-type-box">
              Estimated Pack Value: ${totalPackValue}
            </div>
            <button
              className="add-all-button"
              onClick={() => {
                handleAddAllToCollection(); // Add cards to collection
                handleBacktoOpening(); // Scroll back up
              }}
            >
              Register to Pokedex
            </button>
          </>
        )
      )}

      {/* Remove Card Confirmation Modal (if active) */}
      {isRemoveModalOpen && (
        <div className="modal-overlay-confirmation">
          <div className="modal-content-confirmation">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove this card from your collection?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmRemoveCard}>Yes, Remove</button>
              <button className="cancel-button" onClick={closeRemoveModal}>No, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackOpening;
