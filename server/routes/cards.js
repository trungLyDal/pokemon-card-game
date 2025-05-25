const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// GET /api/cards?page=1&limit=50
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  try {
    const cards = await Card.find().skip(skip).limit(limit);
    const total = await Card.countDocuments();
    res.json({
      cards,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

console.log("✅ Cards route loaded!");


module.exports = router;