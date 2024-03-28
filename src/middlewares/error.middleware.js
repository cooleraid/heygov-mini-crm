
const { DBError } = require('objection');
const { isCelebrateError } = require("celebrate");

const errorMiddleware = (error, req, res, next) => {
  try {
    let status_code = error.statusCode || 500;
    let message = error instanceof DBError ? 'An error was encountered. Contact support' : error.message;

    if (error.name === 'TimeoutError') {
      status_code = 408;
      message = 'Request Timeout';
    }
    if (isCelebrateError(error)) {
      status_code = 400;
      message = error.details
        .get(error.details.keys().next().value)
        .message.replace(/["]+/g, "")
        .replace(/(_)/g, " ");
    }
    res.status(status_code).json({ status: error.status || 'error', message, data: error?.data });
  } catch (error) {
    next(error);
  }
};

module.exports = errorMiddleware;
