const { test, App } = require('../env');

const config = [{
  url: '/posts', method: 'POST',
  allow: {
    canUpdate: { roles: ['client'], fields: ['roles', 'verified'] }
  }
}];

const obj = {
  roles: ['admin', 'stylist'],
  verified: true,
  active: true
};

test('shoud be resolved', async (t) => {
  const app = App(config, {}, { roles: ['admin', 'client'] });
  const { error } = await app.post('/posts').send(obj);
  t.falsy(error);
});
