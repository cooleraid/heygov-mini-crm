const HttpException = require('../exceptions/http.exception');

const clientMiddleware = () => {
  return async (req, res, next) => {
    try {
      console.log(req.header('x-client-id'), 'dssdsd')
      if (!req.header('x-client-id')) return next(new HttpException(401, 'Client ID is required'));
      req.client = { id: req.header('x-client-id') }
      next();
    } catch (error) {
      next(new HttpException(401, error?.message || 'Unauthorized'));
    }
  };
};
module.exports = clientMiddleware;