const _ = require('lodash');
const httpError = require('http-errors');
const hasRole = require('../has-role');

module.exports = () => (payload, allow) => {
  const allowRolesList = _.get(allow, 'roles');
  if (!allowRolesList) return Promise.resolve(true);

  const roles = _.get(payload, 'roles');
  if (!roles) return Promise.reject(httpError(403, 'No role.'));

  const isAllowed = hasRole(allowRolesList, payload);
  if (!isAllowed) return Promise.reject(httpError(403, 'Wrong roles: ' + roles));

  return Promise.resolve(isAllowed);
};
