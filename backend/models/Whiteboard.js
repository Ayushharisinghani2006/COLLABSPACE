const mongoose = require('mongoose');

const WhiteboardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  elements: [{
    id: String,
    type: String,
    position: {
      x: Number,
      y: Number,
    },
    color: String,
    text: String,
    size: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Whiteboard', WhiteboardSchema);