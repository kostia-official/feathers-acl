const { test, App } = require('../env');

const config = [
  {
    url: '/posts', method: 'GET',
    allow: { roles: ['client'] }
  }
];

test('should be allowed to read for client', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.get('/posts');
  t.falsy(error);
});

test('should be allowed to delete all if no option set', async (t) => {
  const app = App(config, { denyNotAllowed: false }, { roles: ['client'] });
  const { error } = await app.delete('/posts');
  t.falsy(error);
});

test('should be denied to delete all for client', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.delete('/posts');
  t.is(error.status, 403);
  t.is(error.text, 'Route is not allowed.');
});
