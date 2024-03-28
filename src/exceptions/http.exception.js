class HttpException extends Error {
  constructor(statusCode, message, data = {}) {
    super(message);
    this.status = 'error';
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
module.exports = HttpException;