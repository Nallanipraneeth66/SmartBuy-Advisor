const express = require("express");
const router = express.Router();
const User = require('../models/User');

const verifyToken = require("../middleware/authMiddleware");

// Protected route
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to your profile!",
    userId: req.user.id
  });
});


// Get user's history
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.json(user.searchHistory || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Add to history
router.post('/history/:userId', async (req, res) => {
  const { userId } = req.params;
  const newSearch = req.body; // { query, resultsCount, timestamp, etc }

  try {
    const user = await User.findById(userId);
    user.searchHistory = [newSearch, ...(user.searchHistory || [])].slice(0, 50);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Get all users (Admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'name email isAdmin'); // Return only selected fields
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Clear history
router.delete('/history/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { searchHistory: [] }, { new: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find({}, "name email isAdmin");
  res.json({ users });
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});


module.exports = router;
