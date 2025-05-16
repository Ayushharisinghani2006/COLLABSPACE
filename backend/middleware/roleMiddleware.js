const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errors');

exports.restrictTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to access this route', 403));
    }
    next();
  });
};