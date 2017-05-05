const _ = require('lodash');
const httpError = require('http-errors');

module.exports = () => (payload, allow, req) => {
  if (!_.get(allow, 'authenticated')) return Promise.resolve(true);
  if (!_.get(req, 'jwt.valid')) return Promise.reject(httpError(401, req.jwt.error));

  return Promise.resolve(true);
};
