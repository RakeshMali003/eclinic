const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User registration
router.post('/register', authController.register);

// Doctor registration
router.post('/register/doctor', upload.fields([
  { name: 'mciReg', maxCount: 1 },
  { name: 'degree', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'clinicLetter', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), authController.registerDoctor);

// Clinic registration
router.post('/register/clinic', authController.registerClinic);

// Email/password login
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

// Get current user
router.get('/me', protect, authController.getCurrentUser);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
