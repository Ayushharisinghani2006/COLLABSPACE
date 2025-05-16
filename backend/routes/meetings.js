const express = require('express');
const router = express.Router();
const { createMeeting, getMeetings } = require('../controllers/meetingController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new meeting (protected)
router.post('/', authMiddleware, createMeeting);

// Get all meetings for the user (protected)
router.get('/', authMiddleware, getMeetings);

module.exports = router;