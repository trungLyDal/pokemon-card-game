const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  hp: { type: Number },
  image: { type: String },
  cardmarket: {
    prices: {
      averageSellPrice: { type: Number, default: 0 },
      lowPrice: { type: Number, default: 0 },
      trendPrice: { type: Number, default: 0 }
    }
  }
});

module.exports = mongoose.model('Card', CardSchema);