const AppError = require("../utils/AppError");

const handleDuplicateKeyError = (error) => {
  const key = Object.keys(error.keyValue)[0];
  return new AppError(`This ${key} is already taken. Please try another`, 401);
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message;

  res.status(statusCode).json({
    statusCode,
    message,
    ...error,
  });
};

module.exports = errorHandler;