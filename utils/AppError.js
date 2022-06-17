class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("5") ? "error" : "fail";

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
