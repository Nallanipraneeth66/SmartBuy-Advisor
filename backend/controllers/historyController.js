const User = require('../models/User');

exports.addToHistory = async (req, res) => {  
  const { userId, query, productType, maxPrice, features, resultsCount } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newEntry = {
  userId: req.body.userId,
  query,
  productType,
  maxPrice,
  features,
  resultsCount,
  timestamp: new Date().toISOString(),
  isInWishlist: false,
};


    // Remove duplicates
    user.searchHistory = user.searchHistory.filter(
      (h) =>
        h.productType !== productType ||
        h.maxPrice !== maxPrice ||
        JSON.stringify(h.features) !== JSON.stringify(features)
    );

    user.searchHistory.unshift(newEntry);
    if (user.searchHistory.length > 50) {
      user.searchHistory = user.searchHistory.slice(0, 50);
    }

    user.markModified('searchHistory'); //  Tell Mongoose we updated nested array
    await user.save();

    res.status(200).json(user.searchHistory);
  } catch (error) {
    console.error(" Error saving history:", error);
    res.status(500).json({ message: 'Error saving history', error });
  }
};



// Get search history
exports.getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ searchHistory: user.searchHistory || [] }); //  wrap in an object
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};
// Clear history
exports.clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.searchHistory = [];
    await user.save();

    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing history', error });
  }
};

exports.deleteHistoryItem = async (req, res) => {
  const { userId, itemId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.searchHistory = user.searchHistory.filter(
      (item) => item._id.toString() !== itemId
    );

    await user.save();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

// Update isInWishlist (Marked) for a specific history item
exports.updateSearchHistoryItem = async (req, res) => {
  const { userId, itemId, isMarked } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const historyItem = user.searchHistory.id(itemId);
    if (!historyItem) return res.status(404).json({ message: 'Item not found' });

    historyItem.isInWishlist = isMarked;
    user.markModified('searchHistory');
    await user.save();
    res.status(200).json({ message: 'Marked updated successfully' });
  } catch (error) {
    console.error('Error updating marked:', error);
    res.status(500).json({ message: 'Error updating marked', error });
  }
};
