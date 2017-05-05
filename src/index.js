const _ = require('lodash');
const ruleChecker = require('./rule-checker');
const jwtDecode = require('./jwt-decode');

module.exports = (configs, { customRules, mongooseConnection, jwt } = {}) => function () {
  const app = this;
  if (jwt) app.use(jwtDecode(jwt));

  const check = ruleChecker({ customRules, mongooseConnection, jwt });

  _.forEach(configs, ({ url, method, allow }) => {

    app.all(url, (req, res, next) => {
      if (method !== req.method) return next();

      check(req.payload, allow, req)
        .then(() => next())
        .catch(err => res.status(err.status || 500).send(err.message));
    });

  });
};
