const { test, App } = require('../env');

test('should be 500 error', async (t) => {
  const config = [{
    url: '/posts', method: 'GET',
    owner: { model: '123', ownerField: 'userId' }
  }];
  const app = App(config, {}, { roles: ['admin'] });
  const { error } = await app.get('/posts');
  t.is(error.status, 500);
});
