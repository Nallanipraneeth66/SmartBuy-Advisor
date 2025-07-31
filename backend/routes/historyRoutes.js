const express = require('express');
const User = require('../models/User');
const router = express.Router();

const {
  addToHistory,
  getHistory,
  clearHistory,
  deleteHistoryItem,
  updateSearchHistoryItem
} = require('../controllers/historyController');
router.post('/add', addToHistory);
router.get('/:userId', getHistory);
router.delete('/clear/:userId', clearHistory);
router.delete('/:userId/delete/:itemId', deleteHistoryItem);
router.post('/update', updateSearchHistoryItem);


// backend/routes/historyRoutes.js
router.patch('/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  const { isInWishlist } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.searchHistory.find((entry) => entry._id.toString() === itemId);
    if (!item) return res.status(404).json({ message: 'History item not found' });

    item.isInWishlist = isInWishlist;

    await user.save();
    res.status(200).json(item);
  } catch (err) {
    console.error('PATCH update error:', err);
    res.status(500).json({ message: 'Error updating history item', error: err });
  }
});

module.exports = router;
