const Meeting = require('../models/Meeting');
const logger = require('../utils/logger');

const createMeeting = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.userId;

    const meeting = new Meeting({
      title,
      creator: userId,
      participants: [userId],
      whiteboard: true,
    });

    await meeting.save();

    res.status(201).json(meeting);
  } catch (err) {
    logger.error(`Create meeting error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMeetings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const meetings = await Meeting.find({ participants: userId }).populate('creator', 'name email');
    res.status(200).json(meetings);
  } catch (err) {
    logger.error(`Get meetings error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.userId;

    const meeting = await Meeting.findById(meetingId)
      .populate('creator', 'name email')
      .populate('participants', 'name email');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Ensure the user is a participant in the meeting
    if (!meeting.participants.some(participant => participant._id.toString() === userId)) {
      return res.status(403).json({ message: 'You are not a participant in this meeting' });
    }

    res.status(200).json(meeting);
  } catch (err) {
    logger.error(`Get meeting by ID error: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createMeeting, getMeetings, getMeetingById };