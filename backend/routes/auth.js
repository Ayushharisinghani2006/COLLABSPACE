const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Debug the import
console.log('Imported authController functions:', { signup, login, me });

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route to get current user (protected)
router.get('/me', authMiddleware, me);

module.exports = router;