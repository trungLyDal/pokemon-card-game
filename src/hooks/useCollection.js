// src/hooks/useCollection.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const USER_COLLECTION_API_URL = `${API_BASE_URL}/api/user-collection`;
const LOCAL_STORAGE_KEY = 'pokemonUserCollectionFallback';

const useCollection = () => {
  const [collection, setCollection] = useState([]);
  // 'loading': initial state, 'online': backend connected, 'offline': backend unreachable
  const [backendStatus, setBackendStatus] = useState('loading');
  // eslint-disable-next-line no-unused-vars
  const [lastLocalSyncTime, setLastLocalSyncTime] = useState(null); // To help with future re-sync logic

  // --- Helper to normalize card data to always have an 'images' object with 'large' and 'small' ---
  const normalizeCardData = useCallback((card) => {
    if (!card) return null; // Handle null or undefined card objects gracefully

    // If the card already has the 'images.large' structure, it's already normalized.
    // This is useful if your backend eventually returns this format or your local data already has it.
    if (card.images && card.images.large) {
      return card;
    }

    // --- CRITICAL: Identify the CORRECT image URL property from your backend/fallback data ---
    // You MUST inspect your API response or 'fallbackPokemonData.json' to find the actual field.
    // Common names: card.imageUrl, card.image, card.artwork, card.spriteUrl, etc.
    const primaryImageUrl = card.imageUrl || card.image || 'https://via.placeholder.com/200x280?text=No+Image'; // Fallback to a placeholder

    return {
      ...card,
      images: {
        large: primaryImageUrl,
        small: primaryImageUrl, // Using the same URL for small for now, adjust if you have a separate small URL
      },
    };
  }, []); // normalizeCardData has no external dependencies, so an empty array is correct

  // --- Helper to save to Local Storage ---
  const saveCollectionToLocalStorage = useCallback((currentCollection) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentCollection));
      setLastLocalSyncTime(Date.now()); // Update last sync time
    } catch (error) {
      console.error("Failed to save collection to localStorage:", error);
      // Optionally notify user that local saving failed
    }
  }, []);

  // --- Helper to load from Local Storage ---
  const loadCollectionFromLocalStorage = useCallback(() => {
    try {
      const storedCollection = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedCollection = storedCollection ? JSON.parse(storedCollection) : [];
      // Normalize data loaded from local storage
      return parsedCollection.map(normalizeCardData).filter(Boolean); // Filter out any nulls if normalizeCardData returns null
    } catch (error) {
      console.error("Failed to parse collection from localStorage, starting fresh:", error);
      return [];
    }
  }, [normalizeCardData]); // Dependency: normalizeCardData

  // --- Function to update collection (attempts backend first, then local fallback) ---
  const updateCollectionState = useCallback(async (operation, payload) => {
    try {
      // Attempt backend operation only if backend is believed to be online or in loading state
      if (backendStatus !== 'offline') {
        let res;
        let requestBody;

        if (operation === 'add' && payload) {
            requestBody = JSON.stringify({ card: payload });
        } else if (operation === 'addMany' && payload) {
            requestBody = JSON.stringify({ cards: payload });
        } else if (operation === 'remove' && payload) {
            requestBody = JSON.stringify({ cardId: payload });
        }

        switch (operation) {
          case 'addMany':
            res = await fetch(`${USER_COLLECTION_API_URL}/addMany`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });
            break;
          case 'add':
            res = await fetch(`${USER_COLLECTION_API_URL}/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });
            break;
          case 'remove':
            res = await fetch(`${USER_COLLECTION_API_URL}/remove`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });
            break;
          case 'clear':
            res = await fetch(`${USER_COLLECTION_API_URL}/clear`, { method: 'POST' });
            break;
          default:
            throw new Error("Unknown collection operation");
        }

        if (!res.ok) {
          throw new Error(`Backend operation failed: ${res.status}`);
        }
        const data = await res.json();
        // Normalize the collection received from the backend BEFORE setting state and saving
        const newBackendCollection = (data.collection || []).map(normalizeCardData).filter(Boolean);
        setCollection(newBackendCollection);
        saveCollectionToLocalStorage(newBackendCollection); // Keep local storage in sync
        setBackendStatus('online'); // Confirm backend is still online
        console.log(`✅ Collection operation '${operation}' successful with backend.`);
      } else {
        // Backend is offline, perform optimistic update locally
        console.warn(`❌ Backend is offline. Performing '${operation}' locally.`);
        let newLocalCollection = [...collection]; // Start with current local state

        switch (operation) {
          case 'addMany':
            payload.forEach(newCard => {
              const normalizedNewCard = normalizeCardData(newCard);
              if (!normalizedNewCard) return;

              const existingIndex = newLocalCollection.findIndex(c => c.id === normalizedNewCard.id);
              if (existingIndex !== -1) {
                newLocalCollection[existingIndex] = {
                  ...newLocalCollection[existingIndex],
                  count: (newLocalCollection[existingIndex].count || 1) + 1,
                };
              } else {
                newLocalCollection.push({ ...normalizedNewCard, count: 1 });
              }
            });
            break;
          case 'add':
            const normalizedNewCard = normalizeCardData(payload);
            if (!normalizedNewCard) break;

            const existingIndexAdd = newLocalCollection.findIndex(c => c.id === normalizedNewCard.id);
            if (existingIndexAdd !== -1) {
              newLocalCollection[existingIndexAdd] = {
                ...newLocalCollection[existingIndexAdd],
                count: (newLocalCollection[existingIndexAdd].count || 1) + 1,
              };
            } else {
              newLocalCollection.push({ ...normalizedNewCard, count: 1 });
            }
            break;
          case 'remove':
            const cardIdToRemove = payload;
            newLocalCollection = newLocalCollection.map(card => {
              if (card.id === cardIdToRemove) {
                if ((card.count || 1) > 1) {
                  return { ...card, count: card.count - 1 };
                }
                return null;
              }
              return card;
            }).filter(Boolean);
            break;
          case 'clear':
            newLocalCollection = [];
            break;
          default:
            console.error("Unknown collection operation in offline mode");
            break;
        }
        setCollection(newLocalCollection);
        saveCollectionToLocalStorage(newLocalCollection);
      }
    } catch (error) {
      console.error(`Error during collection operation '${operation}':`, error);
      // If a backend operation fails, switch to offline mode and apply the change locally.
      if (backendStatus !== 'offline') { // Only switch if not already offline
        setBackendStatus('offline');
        // Re-attempt local update for consistency, as the backend attempt failed
        updateCollectionState(operation, payload); // This will now execute the 'else' block (offline mode)
      }
      // If already offline, the local update already happened (or this is a secondary error).
    }
  }, [backendStatus, collection, saveCollectionToLocalStorage, normalizeCardData]);

  // --- Initial Fetch/Sync Logic ---
  useEffect(() => {
    const fetchAndSyncCollection = async () => {
      try {
        const res = await fetch(USER_COLLECTION_API_URL);
        if (!res.ok) {
          throw new Error(`Backend fetch failed: ${res.status}`);
        }
        const data = await res.json();
        // Normalize the collection received from the backend BEFORE setting state and saving
        const backendCollection = (data.collection || []).map(normalizeCardData).filter(Boolean);
        setCollection(backendCollection);
        setBackendStatus('online');
        saveCollectionToLocalStorage(backendCollection);
        console.log("✅ Collection synced with backend.");

      } catch (error) {
        console.warn("❌ Backend is offline or fetch failed, falling back to local storage:", error);
        // loadCollectionFromLocalStorage already normalizes and filters out nulls
        const localCollection = loadCollectionFromLocalStorage();
        setCollection(localCollection);
        setBackendStatus('offline');
        // Notify user about offline mode, if desired in UI
      }
    };

    fetchAndSyncCollection();
  }, [saveCollectionToLocalStorage, loadCollectionFromLocalStorage, normalizeCardData]); // Dependencies for useCallback

  // --- Public functions for the hook ---
  // Using useCallback to memoize these functions, preventing unnecessary re-renders in child components
  const addManyToCollection = useCallback((cards) => updateCollectionState('addMany', cards), [updateCollectionState]);
  const addToCollection = useCallback((card) => updateCollectionState('add', card), [updateCollectionState]);
  const removeFromCollection = useCallback((cardId) => updateCollectionState('remove', cardId), [updateCollectionState]);
  const removeAllFromCollection = useCallback(() => updateCollectionState('clear'), [updateCollectionState]);

  return {
    collection,
    addToCollection,
    addManyToCollection,
    removeFromCollection,
    removeAllFromCollection,
    backendStatus, // Expose status for UI feedback
  };
};

export default useCollection;