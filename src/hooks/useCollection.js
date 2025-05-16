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
        const updatedCollection = [...prevCollection];
        updatedCollection[existingCardIndex] = {
          ...updatedCollection[existingCardIndex],
          count: (updatedCollection[existingCardIndex].count || 0) + 1,
        };
        return updatedCollection;
      } else {
        return [...prevCollection, { ...card, count: 1 }];
      }
    });
  };

  const removeFromCollection = (cardId) => {
    setCollection(prevCollection => {
      const existingCardIndex = prevCollection.findIndex(c => c.id === cardId);
      if (existingCardIndex !== -1) {
        const updatedCollection = [...prevCollection];
        if (updatedCollection[existingCardIndex].count > 1) {
          updatedCollection[existingCardIndex] = {
            ...updatedCollection[existingCardIndex],
            count: updatedCollection[existingCardIndex].count - 1,
          };
        } else {
          updatedCollection.splice(existingCardIndex, 1);
        }
        return updatedCollection;
      }
      return prevCollection;
    });
  };

  const removeAllFromCollection = () => {
    setCollection([]); // Set the collection state to an empty array
    localStorage.removeItem('pokemonCollection'); // Optionally clear from localStorage as well
  };

  return { collection, addToCollection, removeFromCollection, removeAllFromCollection };
};

export default useCollection;