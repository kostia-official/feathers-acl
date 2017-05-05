const promdash = require('promdash').default;
const rolesRule = require('./rules/roles');
const ownerRule = require('./rules/owner');
const authenticatedRule = require('./rules/authenticated');

module.exports = ({ customRules, mongooseConnection }) => (payload, allow, req) => {
  const rules = Object.assign({
    roles: rolesRule(),
    authenticated: authenticatedRule(),
    owner: ownerRule(mongooseConnection),
  }, customRules);

  return promdash.map(rules, rule => rule(payload, allow, req));
};
