const { test, App, db } = require('../env');

const User = db.model('users');
const userId = '5901af327b35960019ee8b2e';
const config = [{
  url: '/users', method: 'POST',
  allow: {}
}, {
  url: '/users/:id', method: 'GET',
  allow: { roles: ['admin', 'client'], self: { userIdPath: 'params.id' } }
}];

test('should be no error for own profile', async (t) => {
  const user = await User.create({});
  const app = App(config, {}, { userId: user._id, roles: ['client'] });
  const { error } = await app.get('/users/' + user._id);

  t.falsy(error);
});

test('should work with default userIdPath', async (t) => {
  const config = [{
    url: '/users', method: 'POST',
    allow: {}
  }, {
    url: '/users/:id', method: 'GET',
    allow: { roles: ['admin', 'client'], self: true }
  }];
  const user = await User.create({});
  const app = App(config, {}, { userId: user._id, roles: ['client'] });
  const { error } = await app.get('/users/' + user._id);

  t.falsy(error);
});

test('should be rejected for not own profile', async (t) => {
  const app = App(config, {}, { userId: '2', roles: ['client'] });
  const user = await app.post('/users').send();
  const { error } = await app.get('/users/' + user.body._id);

  t.is(error.status, 403);
  t.is(error.text, 'No permissions.');
});

test('should be rejected if no userId field', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const user = await app.post('/users').send();
  const { error } = await app.get('/users/' + user.body._id);

  t.is(error.status, 403);
  t.is(error.text, 'No user id.');
});

test('should be resolved if no rule', async (t) => {
  const config = [
    { url: '/users', method: 'POST', allow: {} },
    { url: '/users/:id', method: 'GET', allow: {} }
  ];
  const app = App(config, {}, { roles: ['client'] });
  const user = await app.post('/users').send();
  const { error } = await app.get('/users/' + user.body._id);

  t.falsy(error);
});

test('should be allowed for admin', async (t) => {
  const app = App(config, { adminRoles: ['admin'] }, { userId: 2, roles: ['admin'] });
  const user = await app.post('/users').send({ userId });
  const { error } = await app.get('/users/' + user.body._id);

  t.falsy(error);
});
