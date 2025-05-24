// server/server.js

// 1. Load environment variables from .env file ONLY in local development
// This line will be ignored by Vercel in production as it handles env vars directly.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
// Ensure these paths are correct relative to your server.js file
const userCollectionRouter = require('./routes/userCollection');
const cardsRouter = require('./routes/cards'); // Assuming ./routes/cards.js exists

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON request bodies

// Configure CORS
// This allows requests from your Netlify frontend and local dev server.
// In production on Vercel, the 'http://localhost:3000' origin will just be ignored.
app.use(cors({
  origin: [
    'https://pokemontcgcollection.netlify.app',
    'http://localhost:3000' // Keep this for your local development setup
  ],
  credentials: true
}));

// --- Health Check Route ---
// Good for verifying your backend is alive
app.get('/api/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

// --- API Routes ---
// Mount your routers under specific API paths
app.use('/api/user-collection', userCollectionRouter);
app.use('/api/cards', cardsRouter); // Assuming cardsRouter is always needed

// --- MongoDB Connection & Server Start Logic ---

// Get MongoDB URI from environment variables
// Make sure this variable (MONGO_URI) is set in your Vercel project settings
const MONGO_URI = process.env.MONGO_URI;

// Define the port for local development
// Vercel will ignore this and use its own internal port
const LOCAL_PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');

    // *** CONDITIONAL SERVER START FOR LOCAL DEVELOPMENT ONLY ***
    // This block will only execute when NODE_ENV is NOT 'production'
    // (e.g., when you run `node server.js` locally)
    if (process.env.NODE_ENV !== 'production') {
      app.listen(LOCAL_PORT, () => {
        console.log(`Local server running on http://localhost:${LOCAL_PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // It's good practice to exit the process if the database connection fails
    process.exit(1);
  });

// *** ESSENTIAL FOR VERCEL: EXPORT THE EXPRESS APP INSTANCE ***
// This is how Vercel's serverless environment will access and run your app.
module.exports = app;