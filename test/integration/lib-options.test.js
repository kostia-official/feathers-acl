const { test, App } = require('../env');

const config = [{
  url: '/posts', method: 'GET',
  allow: { roles: ['client'] }
}];

test('should work without options', async (t) => {
  const app = App(config, undefined, { roles: ['client'] });
  const { error } = await app.get('/posts');
  t.falsy(error);
});
