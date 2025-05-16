const express = require('express');
const router = express.Router();
const { getMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validate');
const { meetingSchema } = require('../middleware/validateRequest');

router.get('/', protect, getMeetings);
router.get('/:id', protect, getMeetingById);
router.post('/', protect, validateBody(meetingSchema), createMeeting);
router.put('/:id', protect, validateBody(meetingSchema), updateMeeting);
router.delete('/:id', protect, deleteMeeting);

module.exports = router;