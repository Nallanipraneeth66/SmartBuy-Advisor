const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// ✅ Add this new route
router.put('/user/update', authController.updateProfile);

module.exports = router;
