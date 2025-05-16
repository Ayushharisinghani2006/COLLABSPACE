const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errors');

module.exports = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return next(new ErrorResponse('Database not connected', 503));
  }
  next();
};