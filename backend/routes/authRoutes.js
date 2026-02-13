const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// Get current user
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
