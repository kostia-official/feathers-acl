const { test, App, jwt } = require('../env');

const config = [
  {
    url: '/posts', method: 'GET',
    allow: { authenticated: false }
  }, {
    url: '/posts', method: 'POST',
    allow: { authenticated: true }
  }, {
    url: '/posts', method: 'DELETE',
    allow: { roles: ['admin'] }
  }
];
const token = jwt.sign({ roles: ['admin'] });

test('should be allowed to create for authenticated', async (t) => {
  const app = App(config, {});
  const { error } = await app.post('/posts').set('Authorization', token);
  t.falsy(error);
});

test('should be denied to create for not authenticated', async (t) => {
  const app = App(config, {}, null);
  const { error } = await app.post('/posts');
  t.is(error.text, 'jwt must be provided');
  t.is(error.status, 401);
});

test('should be allowed to read for anyone', async (t) => {
  const app = App(config, {}, null);
  const { error } = await app.get('/posts');
  t.falsy(error);
});

test('should read role from token', async (t) => {
  const app = App(config, {}, null);
  const { error } = await app.delete('/posts').set('Authorization', token);
  t.falsy(error);
});
