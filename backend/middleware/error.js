/** @format */

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Invalid Server Error";

  // Wrong MongoDB ID Error
  if (err.name === "CastError") {
    const message = `Resource not found - invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Handle duplicate key error - MongoDB
  if (err.name === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Token
  if (err.name === "JsonWebTokenError") {
    const message = `Wrong Json web token, please try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `JWT token has been expired, please try agian`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
