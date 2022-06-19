const AppError = require("../utils/AppError");

const handleDuplicateKeyError = (error) => {
  const key = Object.keys(error.keyValue)[0];
  return new AppError(`This ${key} is already taken. Please try another`, 422);
};

const handleValidationError = (error = {}, req, res) => {
  const { errors } = error;

  if (errors) {
    const message = [];
    for (let field in errors) {
      message.push({ [field]: errors[field].message });
    }
    res.status(422).json({
      statusCode: 422,
      message,
    });
  }
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  handleValidationError(error, req, res);

  console.log({ error });

  if (err.code === 11000) {
    error = handleDuplicateKeyError(error);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message;

  res.status(statusCode).json({
    statusCode,
    message,
    stackTrace: error.stackTrace,
    ...error,
  });
};

module.exports = errorHandler;
