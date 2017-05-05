const { test, App } = require('../env');

const config = [
  {
    url: '/posts', method: 'GET',
    allow: { roles: ['admin', 'client'] }
  }, {
    url: '/posts', method: 'DELETE',
    allow: { roles: ['admin'] }
  }
];

test('should be allowed to read for client', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.get('/posts');
  t.falsy(error);
});

test('should be allowed to read for admin', async (t) => {
  const app = App(config, {}, { roles: ['admin'] });
  const { error } = await app.get('/posts');
  t.falsy(error);
});

test('should be allowed to delete for admin', async (t) => {
  const app = App(config, {}, { roles: ['admin'] });
  const { error } = await app.delete('/posts');
  t.falsy(error);
});

test('should be allowed to read for multi role', async (t) => {
  const app = App(config, {}, { roles: ['admin', 'client'] });
  const { error } = await app.get('/posts');
  t.falsy(error);
});

test('should be denied to delete for user', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.delete('/posts');
  t.is(error.status, 403);
});

test('should be denied to delete for unknown role', async (t) => {
  const app = App(config, {}, { roles: ['god'] });
  const { error } = await app.delete('/posts');
  t.is(error.status, 403);
});

test('should be denied to read for no role', async (t) => {
  const app = App(config, {}, { roles: [] });
  const { error } = await app.delete('/posts');
  t.is(error.status, 403);
});

test('should be denied to delete for no role', async (t) => {
  const app = App(config, {}, { roles: [] });
  const { error } = await app.delete('/posts');
  t.is(error.status, 403);
});
