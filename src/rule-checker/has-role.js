const _ = require('lodash');

module.exports = (adminRoles, payload) => {
  return _.some(adminRoles, (role) => _.includes(_.get(payload, 'roles'), role));
};
