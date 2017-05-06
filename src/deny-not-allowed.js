const _ = require('lodash');

module.exports = () => (req, res, next) => {
  if (!_.has(req, 'acl.allowed')) return res.status(403).send('Route is not allowed.');
  next();
};
