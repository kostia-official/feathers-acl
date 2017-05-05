const _ = require('lodash');
const httpError = require('http-errors');
const buildWhere = require('./build-where');

module.exports = (mongooseConnection) => (payload, allow, req) => {
  return new Promise((resolve, reject) => {
    if (!allow.owner) return resolve(true);
    if (!mongooseConnection) return reject(httpError(500, 'No mongoose connection.'));

    const userId = _.get(payload, 'userId');
    const model = _.get(allow, 'owner.model');
    const where = buildWhere(_.get(allow, 'owner.where'), req);
    const ownerField = _.get(allow, 'owner.ownerField');

    if (!userId) return reject(httpError(403, 'No user id.'));

    const Model = mongooseConnection.model(model);
    Model.findOne(where).then((doc) => {
      if (!doc) return reject(httpError(500, 'Wrong where ' + JSON.stringify(where)));
      if (!isOwner(doc[ownerField], userId)) return reject(httpError(403, 'No permissions.'));

      resolve(true);
    }).catch(reject);
  });
};

function isOwner(ownerValue, userId) {
  return Array.isArray(ownerValue) ?
    _.includes(ownerValue, userId) :
    String(ownerValue) === String(userId);
}
