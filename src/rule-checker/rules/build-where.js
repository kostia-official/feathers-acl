const _ = require('lodash');

module.exports = (where, req) => {
  return _.mapValues(where, (value) => {
    const path = _.trim(value, '{}');
    return _.get(req, path, value);
  });
};
