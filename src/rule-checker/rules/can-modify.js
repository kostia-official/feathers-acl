const _ = require('lodash');
const httpError = require('http-errors');
const hasElement = require('../has-elements');

module.exports = () => (playload, allow, req) => {
  return new Promise((resolve, reject) => {
    const roles = hasElement(
      _.get(allow, 'canUpdate.roles'),
      _.get(playload, 'roles')
    );

    const fields = hasElement(
      _.get(allow, 'canUpdate.fields'),
      Object.keys(req.body)
    );

    if (roles === true && fields === true) {
      resolve(true);
    }

    if (roles === false && fields === true) {
      reject(
        httpError(
          403,
          'User can not modified fields [' +
          _.get(allow, 'canUpdate.fields').join(', ') +
          ']')
      );
    }
  });
};
