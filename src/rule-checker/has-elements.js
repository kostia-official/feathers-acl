const _ = require('lodash');

module.exports = (items, target) => {
  return _.some(items, (item) => _.includes(target, item));
};
