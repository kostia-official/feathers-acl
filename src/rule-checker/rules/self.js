const _ = require('lodash');
const httpError = require('http-errors');

module.exports = () => (payload, allow, req) => {
  const selfRule = _.get(allow, 'self');
  if (!selfRule) return Promise.resolve(true);

  const userId = _.get(payload, 'userId');
  if (!userId) return Promise.reject(httpError(403, 'No user id.'));

  const userIdPath = _.get(selfRule, 'userIdPath') || 'params.id';
  const requestUserId = _.get(req, userIdPath);
  const isAllowed = String(requestUserId) === String(userId);

  if (!isAllowed) return Promise.reject(httpError(403, 'No permissions.'));

  return Promise.resolve(isAllowed);
};
