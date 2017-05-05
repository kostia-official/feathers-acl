const jwt = require('jsonwebtoken');

const secret = 'test';

function sign(data) {
  return jwt.sign(data, secret);
}

module.exports = { secret, sign };
