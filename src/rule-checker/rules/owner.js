const _ = require('lodash');
const httpError = require('http-errors');
const request = require('superagent');

module.exports = (baseUrl) => (payload, allow, req) => {
  return new Promise((resolve, reject) => {
    if (!allow.owner) return resolve(true);
    if (_.has(req, 'headers[x-owner-rule]')) return resolve(true);

    const userId = _.get(payload, 'userId');
    const url = _.get(allow, 'owner.url') || req.url;
    const ownerField = _.get(allow, 'owner.ownerField');

    if (!userId) return reject(httpError(403, 'No user id.'));

    request.get(baseUrl + url)
      .set(Object.assign({ 'x-owner-rule': 'true' }, req.headers))
      .end((err, { body }) => {
        if (err) return reject(err);
        if (!isOwner(body[ownerField], userId)) return reject(httpError(403, 'No permissions.'));

        resolve(true);
      });
  });
};

function isOwner(ownerValue, userId) {
  return Array.isArray(ownerValue) ?
    _.includes(ownerValue, userId) :
    String(ownerValue) === String(userId);
}
