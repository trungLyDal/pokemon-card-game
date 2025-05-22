import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/user-collection';

const useCollection = () => {
  const [collection, setCollection] = useState([]);

  // Fetch collection from backend on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCollection(data.collection || []))
      .catch(() => setCollection([]));
  }, []);

  // Add multiple cards to collection in backend
const addManyToCollection = async (cards) => {
  try {
    const res = await fetch(API_URL + '/addMany', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards }),
    });
    const data = await res.json();
    setCollection(data.collection);
  } catch {
    // handle error
  }
};
const addToCollection = async (card) => {
  try {
    const res = await fetch(API_URL + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card }),
    });
    const data = await res.json();
    setCollection(data.collection);
  } catch {
    // handle error
  }
};  
  // Remove card from collection in backend
  const removeFromCollection = async (cardId) => {
    try {
      const res = await fetch(API_URL + '/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });
      const data = await res.json();
      setCollection(data.collection);
    } catch {
      // handle error
    }
  };

  // Remove all cards from collection in backend
  const removeAllFromCollection = async () => {
    try {
      const res = await fetch(API_URL + '/clear', { method: 'POST' });
      const data = await res.json();
      setCollection(data.collection);
    } catch {
      // handle error
    }
  };

return {
  collection,
  addToCollection,
  addManyToCollection,
  removeFromCollection,
  removeAllFromCollection
};};

export default useCollection;