const promdash = require('promdash').default;
const rolesRule = require('./rules/roles');
const ownerRule = require('./rules/owner');
const canModifyRule = require('./rules/can-modify');
const authenticatedRule = require('./rules/authenticated');
const hasRole = require('./has-role');

module.exports = ({ customRules, baseUrl, adminRoles }) => (payload, allow, req) => {
  if (hasRole(adminRoles, payload)) return Promise.resolve(true);

  const rules = Object.assign({
    roles: rolesRule(),
    authenticated: authenticatedRule(),
    owner: ownerRule(baseUrl),
    canUpdate: canModifyRule(baseUrl),
  }, customRules);

  return promdash.map(rules, rule => rule(payload, allow, req));
};
