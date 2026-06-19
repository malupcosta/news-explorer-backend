const {
  STATUS_INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
} = require("../utils/constants");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const { statusCode = STATUS_INTERNAL_SERVER_ERROR, message } = error;

  return res.status(statusCode).send({
    message:
      statusCode === STATUS_INTERNAL_SERVER_ERROR
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : message,
  });
}

module.exports = errorHandler;
