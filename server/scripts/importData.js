require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Card = require('../models/Card');

const MONGO_URI = process.env.MONGO_URI;
const cardsFile = path.join(__dirname, '..', 'all_pokemon_cards.json');

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const data = JSON.parse(fs.readFileSync(cardsFile, 'utf-8'));
   const cards = data.map(card => ({
  id: card.id,
  name: card.name,
  types: card.types || [],
  hp: Number(card.hp) || 0,
  image: card.images?.large || card.images?.small || '',
  cardmarket: {
    prices: {
      averageSellPrice: card.cardmarket?.prices?.averageSellPrice || 0,
      lowPrice: card.cardmarket?.prices?.lowPrice || 0,
      trendPrice: card.cardmarket?.prices?.trendPrice || 0
    }
  }
}));

    await Card.deleteMany({});
    await Card.insertMany(cards);
    console.log('Cards imported!');
    process.exit();
  })
  .catch(err => {
    console.error('Import error:', err);
    process.exit(1);
  });