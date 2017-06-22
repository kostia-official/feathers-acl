const { test, App } = require('../env');

const config = [{
  url: '/posts', method: 'POST',
  allow: {
    canUpdate: { roles: ['admin'], fields: ['roles', 'verified'] }
  }
}];

const obj = {
  roles: ['admin', 'stylist'],
  verified: true,
  active: true
};

test('should be resolved', async (t) => {
  const app = App(config, {}, { roles: ['admin', 'client'] });
  const { error } = await app.post('/posts').send(obj);
  t.falsy(error);
});

test('should be error', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.post('/posts').send(obj);
  t.is(error.status, 403);
});
