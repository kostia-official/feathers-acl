const _ = require('lodash');
const httpError = require('http-errors');

module.exports = () => (payload, allow) => {
  const allowRolesList = _.get(allow, 'roles');
  if (!allowRolesList) return Promise.resolve(true);

  const roles = _.get(payload, 'roles');
  const isAllowed = _.some(roles, (role) => _.includes(allowRolesList, role));

  if (!isAllowed) return Promise.reject(httpError(403, 'Wrong roles: ' + roles));
  return Promise.resolve(isAllowed);
};
