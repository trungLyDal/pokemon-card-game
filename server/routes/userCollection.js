const express = require('express');
const router = express.Router();
const UserCollection = require('../models/UserCollection');

// Get the user's collection
router.get('/', async (req, res) => {
  try {
    let collection = await UserCollection.findOne();
    if (!collection) {
      collection = new UserCollection({ cards: [] });
      await collection.save();
    }
    res.json({ collection: collection.cards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collection.' });
  }
});

// Add a card to the collection
router.post('/add', async (req, res) => {
  try {
    const { card } = req.body;
    let collection = await UserCollection.findOne();
    if (!collection) {
      collection = new UserCollection({ cards: [card] });
    } else {
      collection.cards.push(card); // <-- Remove the duplicate check
    }
    await collection.save();
    res.json({ collection: collection.cards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add card.' });
  }
});

// Remove a card from the collection
router.post('/remove', async (req, res) => {
  try {
    const { cardId } = req.body;
    let collection = await UserCollection.findOne();
    if (collection) {
      collection.cards = collection.cards.filter(c => c.id !== cardId);
      await collection.save();
    }
    res.json({ collection: collection ? collection.cards : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove card.' });
  }
});

// Clear the collection
router.post('/clear', async (req, res) => {
  try {
    let collection = await UserCollection.findOne();
    if (collection) {
      collection.cards = [];
      await collection.save();
    }
    res.json({ collection: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear collection.' });
  }
});
// Add multiple cards to the collection
router.post('/addMany', async (req, res) => {
  try {
    const { cards } = req.body;
    let collection = await UserCollection.findOne();
    if (!collection) {
      collection = new UserCollection({ cards: [] });
    }
    cards.forEach(card => {
      const existing = collection.cards.find(c => c.id === card.id);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        collection.cards.push({ ...card, count: 1 });
      }
    });
    await collection.save();
    res.json({ collection: collection.cards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add cards.' });
  }
});
module.exports = router;