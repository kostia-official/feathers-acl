const _ = require('lodash');
const ruleChecker = require('./rule-checker');
const jwtDecode = require('./jwt-decode');
const denyNotAllowed = require('./deny-not-allowed');

module.exports = (configs, options = {}) => function () {
  const app = this;
  const check = ruleChecker(options);

  if (options.jwt) app.use(jwtDecode(options.jwt));

  _.forEach(configs, ({ url, method, allow }) => {
    app.all(url, (req, res, next) => {
      if (method !== req.method) return next();
      req.acl = { allowed: true };

      check(req.payload, allow, req)
        .then(() => next())
        .catch(err => res.status(err.status || 500).send(err.message));
    });
  });

  if (options.denyNotAllowed) app.use(denyNotAllowed());
};
