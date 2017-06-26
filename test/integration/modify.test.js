const { test, App } = require('../env');

const config = [{
  url: '/posts', method: 'POST',
  allow: {
    modify: { roles: ['admin'], fields: ['roles', 'verified'] }
  }
}];

const obj = {
  roles: ['admin', 'stylist'],
  verified: true,
  active: true
};

test('should be allowed for admin to modify proper field', async (t) => {
  const app = App(config, {}, { roles: ['admin', 'client'] });
  const { error } = await app.post('/posts').send(obj);
  t.falsy(error);
});

test('should be allowed for client to modify proper field', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.post('/posts').send({ active: false });
  t.falsy(error);
});

test('should be error', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.post('/posts').send(obj);
  t.is(error.status, 403);
});

const emptyRolesConfig = [{
  url: '/posts', method: 'POST',
  allow: {
    modify: { roles: [], fields: ['roles', 'verified'] }
  }
}];

test('empty role should be error', async (t) => {
  const app = App(emptyRolesConfig, {}, { roles: ['admin'] });
  const { error } = await app.post('/posts').send(obj);
  t.is(error.status, 403);
});

const emptyFieldsConfig = [{
  url: '/posts', method: 'POST',
  allow: {
    modify: { roles: ['admin'], fields: [] }
  }
}];

test('empty fields should be error', async (t) => {
  const app = App(emptyFieldsConfig, {}, { roles: ['admin'] });
  const { error } = await app.post('/posts').send(obj);
  t.is(error.status, 403);
});

const emptyConfig = [{
  url: '/posts', method: 'POST',
  allow: {}
}];

test('don\'t have modify', async (t) => {
  const app = App(emptyConfig, {}, { roles: ['admin'] });
  const { error } = await app.post('/posts').send(obj);
  t.false(error);
});
