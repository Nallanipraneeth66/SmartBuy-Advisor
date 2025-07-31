const Feedback = require('../models/feedback.js');
const User = require('../models/User.js'); // if you want user info

exports.submitFeedback = async (req, res) => {
  try {
    const { userId, message } = req.body;
    //console.log("📨 Feedback payload:", { userId, message });
    console.log("REQ BODY:", req.body);

    if (!userId) {
      return res.status(400).json({ error: 'userId is missing' });
    }

    const feedback = new Feedback({ userId, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting feedback:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().populate('userId', 'name email');
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
