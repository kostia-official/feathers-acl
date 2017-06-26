const _ = require('lodash');
const httpError = require('http-errors');
const hasElement = require('../has-elements');

module.exports = () => (playload, allow, req) => {
  return new Promise((resolve, reject) => {
    const modify = _.get(allow, 'modify');
    if (!modify) return resolve(true);

    const allowRoles = _.get(allow, 'modify.roles');
    if (!allowRoles) return reject(httpError(403, '"roles" array is empty for "modify" rule'));
    if (allowRoles.length === 0) return reject(httpError(403, 'Roles is empty'));

    const allowFields = _.get(allow, 'modify.fields');
    if (!allowFields) return reject(httpError(403, '"fields" array is empty for "modify" rule'));
    if (allowFields.length === 0) return reject(httpError(403, 'Fields is empty'));

    const roles = hasElement(
      allowRoles,
      _.get(playload, 'roles')
    );

    const fields = hasElement(
      allowFields,
      Object.keys(req.body)
    );

    if (roles === false && fields === true) {
      reject(
        httpError(
          403,
          'User can not modify fields [' +
          _.get(allow, 'modify.fields').join(', ') +
          ']')
      );
    }

    resolve(true);
  });
};
