const { Service } = require('feathers-mongoose');
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const lib = require('../../src');
const db = require('./db');
const jwt = require('./jwt');
const randomPort = require('get-port-sync');

module.exports = (config, options, payload) => {
  const app = feathers();
  const port = randomPort();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.configure(rest());
  app.configure(hooks());
  app.use((req, res, next) => {
    if (payload) req.payload = payload;
    if (payload) req.headers.authorization = jwt.sign(payload);
    next();
  });
  app.configure(lib(config, options &&
    Object.assign({
      jwt: { secret: jwt.secret }, denyNotAllowed: true, baseUrl: 'http://localhost:' + port
    }, options)));
  app.service('/users', new Service({ Model: db.model('users') }));
  app.service('/posts', new Service({ Model: db.model('posts') }));

  return supertest(app.listen(port));
};
