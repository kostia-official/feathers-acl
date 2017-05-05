const { Service } = require('feathers-mongoose');
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const lib = require('../../src');
const db = require('./db');
const jwt = require('./jwt');

module.exports = (config, customRules, payload) => {
  const app = feathers();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.configure(rest());
  app.configure(hooks());
  app.use((req, res, next) => {
    if (payload) req.headers.authorization = jwt.sign(payload);
    next();
  });
  app.configure(lib(config, {
    customRules, mongooseConnection: db, jwt: { secret: jwt.secret }
  }));
  app.service('/posts', new Service({
    Model: db.model('posts')
  }));

  return supertest(app);
};
