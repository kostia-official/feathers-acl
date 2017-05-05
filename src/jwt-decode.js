const _ = require('lodash');
const jwt = require('jsonwebtoken');

module.exports = ({ header = 'authorization', secret, options = {} }) => (req, res, next) => {
  const token = _.get(req, `headers[${_.toLower(header)}]`);

  req.payload = jwt.verify(token, secret, options, (error, payload) => {
    if (error) {
      req.jwt = { valid: false, error: error.message };
      return next();
    }

    req.jwt = { valid: true };
    req.payload = payload;
    next();
  });
};
