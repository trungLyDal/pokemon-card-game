// src/hooks/useCollection.js
import { useState, useEffect } from 'react';

const useCollection = () => {
  const [collection, setCollection] = useState(() => {
    const storedCollection = localStorage.getItem('pokemonCollection');
    return storedCollection ? JSON.parse(storedCollection) : [];
  });

  useEffect(() => {
    localStorage.setItem('pokemonCollection', JSON.stringify(collection));
  }, [collection]);

  const addToCollection = (card) => {
    setCollection(prevCollection => {
      const existingCardIndex = prevCollection.findIndex(item => item.id === card.id);
      if (existingCardIndex !== -1) {
        // Card already exists, increment count
        const updatedCollection = [...prevCollection];
        updatedCollection[existingCardIndex] = {
          ...updatedCollection[existingCardIndex],
          count: (updatedCollection[existingCardIndex].count || 0) + 1, // Use || 0 to handle undefined count
        };
        return updatedCollection;
      } else {
        // Card doesn't exist, add it with count 1
        return [...prevCollection, { ...card, count: 1 }];
      }
    });
  };

  const removeFromCollection = (cardId) => {
    setCollection(prevCollection => {
      const existingCardIndex = prevCollection.findIndex(c => c.id === cardId);
      if (existingCardIndex !== -1) {
        // Card exists
        const updatedCollection = [...prevCollection];
        if (updatedCollection[existingCardIndex].count > 1) {
          // More than one copy, decrement count
          updatedCollection[existingCardIndex] = {
            ...updatedCollection[existingCardIndex],
            count: updatedCollection[existingCardIndex].count - 1,
          };
        } else {
          // Only one copy, remove the card
          updatedCollection.splice(existingCardIndex, 1);
        }
        return updatedCollection;
      }
      return prevCollection; // Card not found, return existing collection
    });
  };

  return { collection, addToCollection, removeFromCollection };
};

export default useCollection;