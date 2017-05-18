const promdash = require('promdash').default;
const rolesRule = require('./rules/roles');
const ownerRule = require('./rules/owner');
const selfRule = require('./rules/self');
const authenticatedRule = require('./rules/authenticated');
const hasRole = require('./has-role');
const httpError = require('http-errors');

module.exports = ({ customRules, baseUrl, adminRoles }) => (payload, allow, req) => {
  if (!allow) return Promise.reject(httpError(403, 'Route is not allowed.'));
  if (hasRole(adminRoles, payload)) return Promise.resolve(true);

  const rules = Object.assign({
    roles: rolesRule(),
    self: selfRule(),
    authenticated: authenticatedRule(),
    owner: ownerRule(baseUrl),
  }, customRules);

  return promdash.map(rules, rule => rule(payload, allow, req));
};
