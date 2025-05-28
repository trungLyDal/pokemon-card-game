// src/hooks/useCollection.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const USER_COLLECTION_API_URL = `${API_BASE_URL}/api/user-collection`;
const LOCAL_STORAGE_KEY = 'pokemonUserCollectionFallback'; // Key for local fallback data

const useCollection = () => {
  const [collection, setCollection] = useState([]);
  // 'loading': initial state, 'online': backend connected, 'offline': backend unreachable
  const [backendStatus, setBackendStatus] = useState('loading');
  const [lastLocalSyncTime, setLastLocalSyncTime] = useState(null); // To help with future re-sync logic

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
      return storedCollection ? JSON.parse(storedCollection) : [];
    } catch (error) {
      console.error("Failed to parse collection from localStorage, starting fresh:", error);
      return [];
    }
  }, []);

  // --- Initial Fetch/Sync Logic ---
  useEffect(() => {
    const fetchAndSyncCollection = async () => {
      try {
        const res = await fetch(USER_COLLECTION_API_URL);
        if (!res.ok) {
          throw new Error(`Backend fetch failed: ${res.status}`);
        }
        const data = await res.json();
        const backendCollection = data.collection || [];
        setCollection(backendCollection);
        setBackendStatus('online');
        // If backend is available, overwrite local storage with backend's data
        saveCollectionToLocalStorage(backendCollection);
        console.log("✅ Collection synced with backend.");

      } catch (error) {
        console.warn("❌ Backend is offline or fetch failed, falling back to local storage:", error);
        const localCollection = loadCollectionFromLocalStorage();
        setCollection(localCollection);
        setBackendStatus('offline');
        // Notify user about offline mode, if desired in UI
      }
    };

    fetchAndSyncCollection();
  }, [saveCollectionToLocalStorage, loadCollectionFromLocalStorage]); // Dependencies for useCallback

  // --- Function to update collection (both backend and local) ---
  // This is the core logic that all add/remove operations will use
  const updateCollectionState = async (operation, payload) => {
    try {
      if (backendStatus === 'online') {
        let res;
        switch (operation) {
          case 'addMany':
            res = await fetch(`${USER_COLLECTION_API_URL}/addMany`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cards: payload }),
            });
            break;
          case 'add':
            res = await fetch(`${USER_COLLECTION_API_URL}/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ card: payload }),
            });
            break;
          case 'remove':
            res = await fetch(`${USER_COLLECTION_API_URL}/remove`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cardId: payload }),
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
        const newBackendCollection = data.collection || [];
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
              const existingIndex = newLocalCollection.findIndex(c => c.id === newCard.id);
              if (existingIndex !== -1) {
                newLocalCollection[existingIndex] = {
                  ...newLocalCollection[existingIndex],
                  count: (newLocalCollection[existingIndex].count || 1) + 1,
                };
              } else {
                newLocalCollection.push({ ...newCard, count: 1 });
              }
            });
            break;
          case 'add':
            const newCard = payload;
            const existingIndexAdd = newLocalCollection.findIndex(c => c.id === newCard.id);
            if (existingIndexAdd !== -1) {
              newLocalCollection[existingIndexAdd] = {
                ...newLocalCollection[existingIndexAdd],
                count: (newLocalCollection[existingIndexAdd].count || 1) + 1,
              };
            } else {
              newLocalCollection.push({ ...newCard, count: 1 });
            }
            break;
          case 'remove':
            const cardIdToRemove = payload;
            newLocalCollection = newLocalCollection.map(card => {
              if (card.id === cardIdToRemove) {
                if ((card.count || 1) > 1) {
                  return { ...card, count: card.count - 1 };
                }
                return null; // Mark for removal
              }
              return card;
            }).filter(Boolean); // Filter out nulls
            break;
          case 'clear':
            newLocalCollection = [];
            break;
          default:
            break;
        }
        setCollection(newLocalCollection);
        saveCollectionToLocalStorage(newLocalCollection); // Persist local change
      }
    } catch (error) {
      console.error(`Error during collection operation '${operation}':`, error);
      // If a backend operation fails *after* initial online status,
      // switch to offline mode and apply the change locally.
      if (backendStatus === 'online') {
        setBackendStatus('offline');
        // Re-attempt local update for consistency, as the backend attempt failed
        // This might re-run the switch logic, ensuring local state is correctly updated
        updateCollectionState(operation, payload); // Recursive call for local update
      }
      // If already offline, the local update already happened.
    }
  };

  // --- Public functions for the hook ---
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