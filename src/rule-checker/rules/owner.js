const _ = require('lodash');
const httpError = require('http-errors');
const fetch = require('node-fetch');

module.exports = (baseUrl) => (payload, allow, req) => {
  return new Promise((resolve, reject) => {
    if (!allow.owner) return resolve(true);
    if (_.has(req, 'headers[x-owner-rule]')) return resolve(true);

    const userId = _.get(payload, 'userId');
    const url = _.get(allow, 'owner.url') || req.url;
    const ownerField = _.get(allow, 'owner.ownerField');

    if (!userId) return reject(httpError(403, 'No user id.'));

    fetch(baseUrl + url, {
      method: 'GET', headers: Object.assign({ 'x-owner-rule': 'true' }, req.headers)
    })
      .then((res) => res.json())
      .then((doc) => {
        if (!isOwner(doc[ownerField], userId)) return reject(httpError(403, 'No permissions.'));

        resolve(true);
      })
      .catch(reject);
  });
};

function isOwner(ownerValue, userId) {
  return Array.isArray(ownerValue) ?
    _.includes(ownerValue, userId) :
    String(ownerValue) === String(userId);
}
