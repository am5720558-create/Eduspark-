const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  login
);

// Get current user
router.get('/me', protect, getMe);

// Update profile
router.put('/profile', protect, updateProfile);

// Change password
router.put(
  '/password',
  [
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'New password must be 6 or more characters').isLength({
      min: 6,
    }),
  ],
  protect,
  changePassword
);

module.exports = router;