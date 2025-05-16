const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  whiteboard: {
    type: Boolean,
    default: true, // Automatically enable whiteboard for new meetings
  },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);