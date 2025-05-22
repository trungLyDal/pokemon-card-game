const mongoose = require('mongoose');

const UserCollectionSchema = new mongoose.Schema({
  // Add a user identifier here if you want per-user collections in the future
  cards: [
    {
      id: String,
      name: String,
      types: [String],
      hp: Number,
      image: String,
      cardmarket: {
        prices: {
          averageSellPrice: Number,
          lowPrice: Number,
          trendPrice: Number
        }
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserCollection', UserCollectionSchema);