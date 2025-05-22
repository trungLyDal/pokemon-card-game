require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
const userCollectionRouter = require('./routes/userCollection');
const cardsRouter = require('./routes/cards'); // If you have a cards.js for /api/cards

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://pokemontcgcollection.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
})); // Allow frontend dev server
app.use(express.json());

// API routes
app.use('/api/user-collection', userCollectionRouter);
// If you have a cards route for fetching cards:
try {
  app.use('/api/cards', require('./routes/cards'));
} catch (e) {
  // If you don't have cards.js, ignore this
}

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });