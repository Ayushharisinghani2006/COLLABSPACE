const asyncHandler = require('../middleware/async');
const Whiteboard = require('../models/Whiteboard');
const ErrorResponse = require('../utils/errors');

exports.getWhiteboards = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const whiteboards = await Whiteboard.find()
    .skip(startIndex)
    .limit(limit);
  
  res.status(200).json({ success: true, data: whiteboards });
});

exports.getWhiteboardById = asyncHandler(async (req, res, next) => {
  const whiteboard = await Whiteboard.findById(req.params.id);
  if (!whiteboard) {
    return next(new ErrorResponse('Whiteboard not found', 404));
  }

  res.status(200).json({ success: true, data: whiteboard });
});

exports.createWhiteboard = asyncHandler(async (req, res, next) => {
  const whiteboard = await Whiteboard.create(req.body);
  res.status(201).json({ success: true, data: whiteboard });
});

exports.updateWhiteboard = asyncHandler(async (req, res, next) => {
  const whiteboard = await Whiteboard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!whiteboard) {
    return next(new ErrorResponse('Whiteboard not found', 404));
  }
  
  res.status(200).json({ success: true, data: whiteboard });
});

exports.deleteWhiteboard = asyncHandler(async (req, res, next) => {
  const whiteboard = await Whiteboard.findByIdAndDelete(req.params.id);
  if (!whiteboard) {
    return next(new ErrorResponse('Whiteboard not found', 404));
  }
  
  res.status(200).json({ success: true, message: 'Whiteboard deleted' });
});