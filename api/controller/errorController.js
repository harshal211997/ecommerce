const AppError = require("../utils/appError.js");

sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "developement") {
    sendErrorDev(err, res);
  }
};
